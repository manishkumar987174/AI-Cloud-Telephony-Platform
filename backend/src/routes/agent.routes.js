import { Router } from 'express';
import * as controller from '../controllers/agent.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add agent routes
// router.get('/', authenticate, controller.getAll)

export default router;
