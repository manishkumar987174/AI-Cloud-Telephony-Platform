import { prisma } from '../config/database.js';
import { humanizeDatabaseRecord } from '../utils/databaseHelper.js';
import { makeOutboundCall, hangupCall, simulateCallEvents } from '../telephony/freeswitch/freeswitchService.js';
import logger from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Get all call logs for the authenticated user's company (SaaS Isolation)
 */
export const getAll = async (req, res, next) => {
  try {
    const companyId = BigInt(req.user.companyId);

    const callLogs = await prisma.callLog.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
      include: {
        agent: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        campaign: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: humanizeDatabaseRecord(callLogs)
    });
  } catch (error) {
    logger.error('Error fetching call logs: %s', error.message);
    next(error);
  }
};

/**
 * Initiate an outbound call (Agent Dialer pad or Campaign dialer)
 */
export const makeCall = async (req, res, next) => {
  try {
    const { phoneNumber, campaignId } = req.body;
    const companyId = req.user.companyId;
    const agentId = req.user.id;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        error: { message: 'Phone number is required to make a call.' }
      });
    }

    const result = await makeOutboundCall(companyId, agentId, phoneNumber, campaignId);

    res.status(200).json({
      success: true,
      message: 'Call initialization command sent',
      data: {
        uuid: result.uuid,
        simulated: result.simulated
      }
    });
  } catch (error) {
    logger.error('Error in makeCall: %s', error.message);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to place call' }
    });
  }
};

/**
 * Disconnect an active call channel
 */
export const hangupCall = async (req, res, next) => {
  try {
    const { uuid } = req.body;

    if (!uuid) {
      return res.status(400).json({
        success: false,
        error: { message: 'Channel UUID is required to hang up a call.' }
      });
    }

    const result = await hangupCall(uuid);

    res.status(200).json({
      success: true,
      message: 'Hangup command successfully sent',
      data: result
    });
  } catch (error) {
    logger.error('Error in hangupCall: %s', error.message);
    res.status(500).json({
      success: false,
      error: { message: error.message || 'Failed to hang up call' }
    });
  }
};

/**
 * Force a simulated call flow for manual/QA developer testing
 */
export const simulateCall = async (req, res, next) => {
  try {
    // Only allow in development mode for safety
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({
        success: false,
        error: { message: 'Simulations are restricted to development mode' }
      });
    }

    const { phoneNumber = '+15550199', campaignId = null } = req.body;
    const companyId = req.user.companyId;
    const agentId = req.user.id;

    const simulatedUuid = uuidv4();

    // Trigger simulation in background
    simulateCallEvents(companyId, agentId, phoneNumber, campaignId, simulatedUuid);

    res.status(200).json({
      success: true,
      message: 'Simulated call sequence triggered successfully',
      data: {
        uuid: simulatedUuid,
        phoneNumber,
        status: 'simulating'
      }
    });
  } catch (error) {
    logger.error('Error initiating simulated call: %s', error.message);
    next(error);
  }
};
