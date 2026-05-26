import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import campaignRoutes from './campaign.routes.js';
import contactRoutes from './contact.routes.js';
import callRoutes from './call.routes.js';
import recordingRoutes from './recording.routes.js';
import ivrRoutes from './ivr.routes.js';
import billingRoutes from './billing.routes.js';
import analyticsRoutes from './analytics.routes.js';
import agentRoutes from './agent.routes.js';
import webhookRoutes from './webhook.routes.js';
import databaseRoutes from './database.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/contacts', contactRoutes);
router.use('/calls', callRoutes);
router.use('/recordings', recordingRoutes);
router.use('/ivr', ivrRoutes);
router.use('/billing', billingRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/agents', agentRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/database', databaseRoutes);

router.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

export default router;
