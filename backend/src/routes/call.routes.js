import { Router } from 'express';
import * as controller from '../controllers/call.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// Retrieve all call logs for the company (Multi-tenant)
router.get('/', authenticate, controller.getAll);

// Place an outbound call (Initiates Sofia gateway bridge / or simulation if offline)
router.post('/make', authenticate, controller.makeCall);

// Hangup an active call session (Sends uuid_kill command)
router.post('/hangup', authenticate, controller.hangupCall);

// Developer mock simulation endpoint (Only active in development environments)
router.post('/simulate', authenticate, controller.simulateCall);

export default router;
