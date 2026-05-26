import { Router } from 'express';
import * as controller from '../controllers/webhook.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add webhook routes
// router.get('/', authenticate, controller.getAll)

export default router;
