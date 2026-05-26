import esl from 'modesl';
import logger from '../../utils/logger.js';
import { getRedisClient } from '../../config/redis.js';
import { prisma } from '../../config/database.js';
import { emitToCompany } from '../../socket/index.js';
import { debitCall } from '../../billing/billingService.js';

let activeConnection = null;
let reconnectTimer = null;

const getActiveConnection = () => activeConnection;

const initESL = () => {
  const host = process.env.FREESWITCH_HOST || '127.0.0.1';
  const port = parseInt(process.env.FREESWITCH_ESL_PORT || '8021', 10);
  const password = process.env.FREESWITCH_ESL_PASSWORD || 'ClueCon';

  logger.info(`Attempting to connect to FreeSWITCH ESL on ${host}:${port}...`);

  try {
    const conn = new esl.Connection(host, port, password, () => {
      logger.info(`Successfully connected to FreeSWITCH ESL on ${host}:${port}`);
      activeConnection = conn;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      // Subscribe to relevant events
      conn.subscribe(['CHANNEL_CREATE', 'CHANNEL_ANSWER', 'CHANNEL_HANGUP', 'RECORD_START', 'RECORD_STOP'], () => {
        logger.info('Subscribed to FreeSWITCH call channel events');
      });

      // Register event listeners
      conn.on('esl::event::CHANNEL_CREATE::*', handleChannelCreate);
      conn.on('esl::event::CHANNEL_ANSWER::*', handleChannelAnswer);
      conn.on('esl::event::CHANNEL_HANGUP::*', handleChannelHangup);
      conn.on('esl::event::RECORD_START::*', handleRecordStart);
      conn.on('esl::event::RECORD_STOP::*', handleRecordStop);
    });

    conn.on('error', (err) => {
      logger.error(`FreeSWITCH ESL Connection Error: ${err.message || err}`);
      handleReconnect();
    });

    conn.on('end', () => {
      logger.warn('FreeSWITCH ESL Connection ended');
      handleReconnect();
    });

  } catch (error) {
    logger.error(`Failed to initialize FreeSWITCH ESL Connection: ${error.message}`);
    handleReconnect();
  }
};

const handleReconnect = () => {
  activeConnection = null;
  if (!reconnectTimer) {
    logger.info('Scheduling ESL connection retry in 5 seconds...');
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      initESL();
    }, 5000);
  }
};

// HELPER FOR EXTRACTING EVENT HEADERS
const getFSHeader = (evt, name) => {
  return evt.getHeader(`variable_${name}`) || evt.getHeader(name);
};

// HELPER FOR REDIS
const setRedis = async (key, val) => {
  try {
    const redis = getRedisClient();
    if (redis) await redis.set(key, JSON.stringify(val), { EX: 86400 }); // 24 hours
  } catch (_) {}
};

const getRedis = async (key) => {
  try {
    const redis = getRedisClient();
    if (redis) {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    }
  } catch (_) {}
  return null;
};

const delRedis = async (key) => {
  try {
    const redis = getRedisClient();
    if (redis) await redis.del(key);
  } catch (_) {}
};

// EVENT HANDLERS

const handleChannelCreate = async (evt) => {
  try {
    const uuid = evt.getHeader('Unique-ID');
    const destinationNumber = evt.getHeader('Caller-Destination-Number');
    const callerIdNumber = evt.getHeader('Caller-Caller-ID-Number');
    
    const companyIdStr = getFSHeader(evt, 'company_id') || '1'; // Default / fallback
    const agentIdStr = getFSHeader(evt, 'agent_id');
    const campaignIdStr = getFSHeader(evt, 'campaign_id');
    const direction = evt.getHeader('Call-Direction') || 'outbound';

    const companyId = BigInt(companyIdStr);
    const agentId = agentIdStr ? BigInt(agentIdStr) : null;
    const campaignId = campaignIdStr ? BigInt(campaignIdStr) : null;
    const customerPhone = direction === 'outbound' ? destinationNumber : callerIdNumber;

    logger.info(`[ESL EVENT] CHANNEL_CREATE: UUID ${uuid}, Phone ${customerPhone}, Company ${companyIdStr}`);

    // Create database log record
    const callLog = await prisma.callLog.create({
      data: {
        companyId,
        agentId,
        campaignId,
        phoneNumber: customerPhone,
        status: 'no_answer',
        direction: direction === 'inbound' ? 'inbound' : 'outbound',
        startedAt: null,
        endedAt: null
      }
    });

    // Save active call log details in Redis so subsequent events can fetch them
    await setRedis(`call:${uuid}`, {
      callLogId: callLog.id.toString(),
      companyId: companyIdStr,
      agentId: agentIdStr || null,
      campaignId: campaignIdStr || null,
      phoneNumber: customerPhone
    });

    // Broadcast live event to company dashboard
    emitToCompany(companyId, 'call_started', {
      uuid,
      callLogId: callLog.id.toString(),
      phoneNumber: customerPhone,
      direction,
      status: 'ringing',
      agentId: agentIdStr || null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling CHANNEL_CREATE ESL event: %s', error.message);
  }
};

const handleChannelAnswer = async (evt) => {
  try {
    const uuid = evt.getHeader('Unique-ID');
    logger.info(`[ESL EVENT] CHANNEL_ANSWER: UUID ${uuid}`);

    const mapping = await getRedis(`call:${uuid}`);
    if (!mapping) {
      logger.warn(`No active call log mapping found in Redis for answered channel UUID: ${uuid}`);
      return;
    }

    const startedAt = new Date();

    // Update database call log status to answered
    await prisma.callLog.update({
      where: { id: BigInt(mapping.callLogId) },
      data: {
        status: 'answered',
        startedAt
      }
    });

    emitToCompany(mapping.companyId, 'call_answered', {
      uuid,
      callLogId: mapping.callLogId,
      status: 'active',
      startedAt: startedAt.toISOString(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling CHANNEL_ANSWER ESL event: %s', error.message);
  }
};

const handleRecordStart = async (evt) => {
  try {
    const uuid = evt.getHeader('Unique-ID');
    const recordingUrl = evt.getHeader('Record-File-Path') || `/recordings/company_1/${uuid}.wav`;
    logger.info(`[ESL EVENT] RECORD_START: UUID ${uuid}, URL ${recordingUrl}`);

    const mapping = await getRedis(`call:${uuid}`);
    if (!mapping) return;

    await prisma.callLog.update({
      where: { id: BigInt(mapping.callLogId) },
      data: { recordingUrl }
    });

    emitToCompany(mapping.companyId, 'recording_started', {
      uuid,
      callLogId: mapping.callLogId,
      recordingUrl,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling RECORD_START ESL event: %s', error.message);
  }
};

const handleRecordStop = async (evt) => {
  try {
    const uuid = evt.getHeader('Unique-ID');
    const recordingUrl = evt.getHeader('Record-File-Path') || `/recordings/company_1/${uuid}.wav`;
    logger.info(`[ESL EVENT] RECORD_STOP: UUID ${uuid}`);

    const mapping = await getRedis(`call:${uuid}`);
    if (!mapping) return;

    const callLog = await prisma.callLog.findUnique({
      where: { id: BigInt(mapping.callLogId) }
    });

    let durationSeconds = 0;
    if (callLog && callLog.startedAt) {
      durationSeconds = Math.round((new Date() - callLog.startedAt) / 1000);
    }

    // Insert new recording log
    const recording = await prisma.recording.create({
      data: {
        companyId: BigInt(mapping.companyId),
        callLogId: BigInt(mapping.callLogId),
        recordingUrl,
        duration: durationSeconds,
        transcript: 'Recording saved. Transcript processing will be initiated.'
      }
    });

    emitToCompany(mapping.companyId, 'recording_stopped', {
      uuid,
      callLogId: mapping.callLogId,
      recordingId: recording.id.toString(),
      recordingUrl,
      duration: durationSeconds,
      transcript: recording.transcript,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling RECORD_STOP ESL event: %s', error.message);
  }
};

const handleChannelHangup = async (evt) => {
  try {
    const uuid = evt.getHeader('Unique-ID');
    logger.info(`[ESL EVENT] CHANNEL_HANGUP: UUID ${uuid}`);

    const mapping = await getRedis(`call:${uuid}`);
    if (!mapping) {
      logger.warn(`No active call log mapping found in Redis for hangup channel UUID: ${uuid}`);
      return;
    }

    // Remove active call details from Redis
    await delRedis(`call:${uuid}`);

    // Fetch the active call log details from DB
    const callLog = await prisma.callLog.findUnique({
      where: { id: BigInt(mapping.callLogId) }
    });

    if (!callLog) {
      logger.error(`CallLog not found in DB for mapping ID ${mapping.callLogId}`);
      return;
    }

    const endedAt = new Date();
    const durationSeconds = callLog.startedAt ? Math.round((endedAt - callLog.startedAt) / 1000) : 0;
    const finalStatus = callLog.startedAt ? 'answered' : 'no_answer';

    // Update database record with final details
    await prisma.callLog.update({
      where: { id: BigInt(mapping.callLogId) },
      data: {
        endedAt,
        duration: durationSeconds,
        status: finalStatus
      }
    });

    // Execute Billing Debit
    const company = await prisma.company.findUnique({
      where: { id: BigInt(mapping.companyId) }
    });
    const rate = company ? Number(company.ratePerMinute) : 1.00;

    let billingResult = null;
    try {
      billingResult = await debitCall(mapping.companyId, mapping.callLogId, durationSeconds, rate);
    } catch (billingErr) {
      logger.error(`Billing debit failed for call ${mapping.callLogId}: ${billingErr.message}`);
    }

    // Broadcast socket event
    emitToCompany(mapping.companyId, 'call_ended', {
      uuid,
      callLogId: mapping.callLogId,
      status: 'completed',
      duration: durationSeconds,
      endedAt: endedAt.toISOString(),
      billing: billingResult ? {
        chargedAmount: billingResult.amount,
        newBalance: Number(billingResult.balance)
      } : null,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    logger.error('Error handling CHANNEL_HANGUP ESL event: %s', error.message);
  }
};

export {
  initESL,
  getActiveConnection
};
