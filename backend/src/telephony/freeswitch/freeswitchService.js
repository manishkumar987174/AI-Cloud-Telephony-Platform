import logger from '../../utils/logger.js';
import { getRedisClient } from '../../config/redis.js';
import { prisma } from '../../config/database.js';
import { emitToCompany } from '../../socket/index.js';
import { debitCall } from '../../billing/billingService.js';
import { getActiveConnection } from '../esl/eslClient.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get active ESL connection
 */
function getESLConnection() {
  return getActiveConnection();
}

/**
 * Initiate an outbound call via FreeSWITCH
 * In a real deployment, this sends an 'originate' command over the Event Socket.
 */
async function makeOutboundCall(companyId, agentId, customerPhone, campaignId = null) {
  const companyIdBigInt = BigInt(companyId);
  const agentIdBigInt = agentId ? BigInt(agentId) : null;
  const campaignIdBigInt = campaignId ? BigInt(campaignId) : null;

  logger.info(`Initiating outbound call from Agent ${agentId || 'System'} to Customer ${customerPhone} (Company ${companyId})`);

  // 1. Enforce SaaS check (verify company and wallet balance first)
  const [company, wallet] = await Promise.all([
    prisma.company.findUnique({ where: { id: companyIdBigInt } }),
    prisma.wallet.findUnique({ where: { companyId: companyIdBigInt } })
  ]);

  if (!company) {
    throw new Error('Company not found');
  }

  if (!wallet || Number(wallet.balance) <= 0.00) {
    throw new Error('Insufficient wallet balance to place outbound call');
  }

  // Retrieve active ESL connection
  const conn = getESLConnection();

  if (conn) {
    // REAL FREESWITCH ESL DEPLOYMENT FLOW
    // Formulate variables to pass as custom headers in FreeSWITCH
    const fsVars = [
      `company_id=${companyId}`,
      `agent_id=${agentId || ''}`,
      `campaign_id=${campaignId || ''}`,
      `origination_caller_id_number=${process.env.SIP_CALLER_ID || '1000'}`,
      `sip_h_X-Company-ID=${companyId}`
    ].join(',');

    // Sofia profile and dialstring
    // In our local architecture, we bridge the SIP client (agent) with the gateway (SIP trunk/PSTN)
    const dialString = `{${fsVars}}sofia/internal/sip:${customerPhone}@${process.env.SIP_TRUNK_HOST || 'sip.tata.com'}`;
    const cmd = `originate ${dialString} &park()`;

    logger.info(`Sending FreeSWITCH originate command: ${cmd}`);

    return new Promise((resolve, reject) => {
      conn.bgapi(cmd, (evt) => {
        const response = evt.getBody();
        if (response.startsWith('+OK')) {
          const uuid = response.split(' ')[1]?.trim();
          logger.info(`FreeSWITCH successfully placed call. Channel UUID: ${uuid}`);
          resolve({ success: true, uuid, simulated: false });
        } else {
          logger.error(`FreeSWITCH originate failed: ${response}`);
          reject(new Error(`FreeSWITCH gateway error: ${response}`));
        }
      });
    });
  } else {
    // OFFLINE SIMULATION FALLBACK
    logger.warn('FreeSWITCH is not running locally. Falling back to simulation mode.');
    // Generate a simulated UUID
    const simulatedUuid = uuidv4();

    // Trigger simulation in the background
    simulateCallEvents(companyId, agentId, customerPhone, campaignId, simulatedUuid);

    return {
      success: true,
      uuid: simulatedUuid,
      simulated: true,
      message: 'Call initiated in Simulation Mode (FreeSWITCH ESL offline)'
    };
  }
}

/**
 * Hangup an active call channel
 */
async function hangupCall(channelUuid) {
  logger.info(`Hanging up call channel: ${channelUuid}`);
  const conn = getESLConnection();

  if (conn) {
    // REAL FREESWITCH HANGUP
    return new Promise((resolve, reject) => {
      conn.bgapi(`uuid_kill ${channelUuid}`, (evt) => {
        const response = evt.getBody();
        logger.info(`FreeSWITCH hangup response: ${response}`);
        resolve({ success: true, response });
      });
    });
  } else {
    // SIMULATION HANGUP
    // Retrieve simulation reference or handle gracefully
    logger.info(`Simulated hangup command executed for: ${channelUuid}`);
    
    // Check if mapping exists in Redis to terminate it early
    const redis = getRedisClient();
    if (redis) {
      const mapping = await redis.get(`call:${channelUuid}`);
      if (mapping) {
        // We'll let the active simulation know to end, or trigger manual end
        logger.info('Simulated active call mapping found in Redis.');
      }
    }
    
    return { success: true, simulated: true, message: 'Simulated hangup triggered' };
  }
}

/**
 * Simulates a realistic real-time telephone call timeline
 * Timings:
 * - Immediate: CHANNEL_CREATE (Status: no_answer)
 * - +2 seconds: CHANNEL_ANSWER (Status: answered, startedAt)
 * - +1 second: RECORD_START (recordingUrl)
 * - +5 seconds: RECORD_STOP (duration calculation)
 * - +0.5 seconds: CHANNEL_HANGUP (duration update, wallet debit, transaction logged)
 */
function simulateCallEvents(companyId, agentId, customerPhone, campaignId, uuid) {
  const companyIdBigInt = BigInt(companyId);
  const agentIdBigInt = agentId ? BigInt(agentId) : null;
  const campaignIdBigInt = campaignId ? BigInt(campaignId) : null;

  logger.info(`[SIMULATION] Starting call event loop for UUID: ${uuid}`);

  let callLogId = null;
  let startedAt = null;

  // Helper to handle Redis safely
  const setRedis = async (key, val) => {
    try {
      const redis = getRedisClient();
      if (redis) await redis.set(key, JSON.stringify(val), { EX: 3600 });
    } catch (_) {}
  };

  const getRedis = async (key) => {
    try {
      const redis = getRedisClient();
      if (redis) return JSON.parse(await redis.get(key));
    } catch (_) {}
    return null;
  };

  const delRedis = async (key) => {
    try {
      const redis = getRedisClient();
      if (redis) await redis.del(key);
    } catch (_) {}
  };

  // STEP 1: CHANNEL_CREATE (Immediate)
  setTimeout(async () => {
    try {
      logger.info(`[SIMULATION] [CHANNEL_CREATE] Call initiated to ${customerPhone}`);
      
      const callLog = await prisma.callLog.create({
        data: {
          companyId: companyIdBigInt,
          agentId: agentIdBigInt,
          campaignId: campaignIdBigInt,
          phoneNumber: customerPhone,
          status: 'no_answer',
          direction: 'outbound',
          startedAt: null,
          endedAt: null
        }
      });

      callLogId = callLog.id;

      // Save mapping in Redis
      await setRedis(`call:${uuid}`, {
        callLogId: callLogId.toString(),
        companyId: companyId.toString(),
        agentId: agentId ? agentId.toString() : null,
        campaignId: campaignId ? campaignId.toString() : null,
        phoneNumber: customerPhone
      });

      // Broadcast Socket event
      emitToCompany(companyId, 'call_started', {
        uuid,
        callLogId: callLogId.toString(),
        phoneNumber: customerPhone,
        direction: 'outbound',
        status: 'ringing',
        agentId: agentId ? agentId.toString() : null,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      logger.error(`[SIMULATION] Error on CHANNEL_CREATE: ${err.message}`);
    }
  }, 100);

  // STEP 2: CHANNEL_ANSWER (+2.5 seconds)
  setTimeout(async () => {
    try {
      const mapping = await getRedis(`call:${uuid}`);
      if (!mapping) return; // Terminated early

      logger.info(`[SIMULATION] [CHANNEL_ANSWER] Call answered by customer ${customerPhone}`);
      startedAt = new Date();

      await prisma.callLog.update({
        where: { id: BigInt(mapping.callLogId) },
        data: {
          status: 'answered',
          startedAt
        }
      });

      emitToCompany(companyId, 'call_answered', {
        uuid,
        callLogId: mapping.callLogId,
        status: 'active',
        startedAt: startedAt.toISOString(),
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      logger.error(`[SIMULATION] Error on CHANNEL_ANSWER: ${err.message}`);
    }
  }, 2500);

  // STEP 3: RECORD_START (+3.5 seconds)
  setTimeout(async () => {
    try {
      const mapping = await getRedis(`call:${uuid}`);
      if (!mapping) return;

      logger.info(`[SIMULATION] [RECORD_START] Audio recording started for call UUID: ${uuid}`);
      const mockRecordingUrl = `/recordings/company_${companyId}/${uuid}.wav`;

      await prisma.callLog.update({
        where: { id: BigInt(mapping.callLogId) },
        data: {
          recordingUrl: mockRecordingUrl
        }
      });

      emitToCompany(companyId, 'recording_started', {
        uuid,
        callLogId: mapping.callLogId,
        recordingUrl: mockRecordingUrl,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      logger.error(`[SIMULATION] Error on RECORD_START: ${err.message}`);
    }
  }, 3500);

  // STEP 4: RECORD_STOP (+8.5 seconds)
  setTimeout(async () => {
    try {
      const mapping = await getRedis(`call:${uuid}`);
      if (!mapping) return;

      logger.info(`[SIMULATION] [RECORD_STOP] Recording stopped for call UUID: ${uuid}`);
      const mockRecordingUrl = `/recordings/company_${companyId}/${uuid}.wav`;

      // Save recording entry in MySQL
      const durationSeconds = Math.round((new Date() - startedAt) / 1000);
      
      const recording = await prisma.recording.create({
        data: {
          companyId: companyIdBigInt,
          callLogId: BigInt(mapping.callLogId),
          recordingUrl: mockRecordingUrl,
          duration: durationSeconds,
          transcript: `[Simulated Customer Voice] Hello, this is a customer call log transcription. We discussed Phase 4 integration and confirmed everything is connected correctly.`
        }
      });

      emitToCompany(companyId, 'recording_stopped', {
        uuid,
        callLogId: mapping.callLogId,
        recordingId: recording.id.toString(),
        recordingUrl: mockRecordingUrl,
        duration: durationSeconds,
        transcript: recording.transcript,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      logger.error(`[SIMULATION] Error on RECORD_STOP: ${err.message}`);
    }
  }, 8500);

  // STEP 5: CHANNEL_HANGUP (+9.5 seconds)
  setTimeout(async () => {
    try {
      const mapping = await getRedis(`call:${uuid}`);
      if (!mapping) return;

      logger.info(`[SIMULATION] [CHANNEL_HANGUP] Call hung up by customer/agent`);
      const endedAt = new Date();
      const duration = startedAt ? Math.round((endedAt - startedAt) / 1000) : 0;

      // Update call log database entry
      await prisma.callLog.update({
        where: { id: BigInt(mapping.callLogId) },
        data: {
          endedAt,
          duration,
          status: 'answered'
        }
      });

      // Clear from Redis
      await delRedis(`call:${uuid}`);

      // Perform billing debit
      const company = await prisma.company.findUnique({
        where: { id: companyIdBigInt }
      });
      const rate = company ? Number(company.ratePerMinute) : 1.00;

      let billingResult = null;
      try {
        billingResult = await debitCall(companyId, mapping.callLogId, duration, rate);
      } catch (billingErr) {
        logger.error(`[SIMULATION] Billing debit failed: ${billingErr.message}`);
      }

      emitToCompany(companyId, 'call_ended', {
        uuid,
        callLogId: mapping.callLogId,
        status: 'completed',
        duration,
        endedAt: endedAt.toISOString(),
        billing: billingResult ? {
          chargedAmount: billingResult.amount,
          newBalance: Number(billingResult.balance)
        } : null,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      logger.error(`[SIMULATION] Error on CHANNEL_HANGUP: ${err.message}`);
    }
  }, 9500);
}

export {
  makeOutboundCall,
  hangupCall,
  simulateCallEvents
};
