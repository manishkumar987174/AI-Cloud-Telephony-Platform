import { Router } from 'express';
import * as controller from '../controllers/recording.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add recording routes
// router.get('/', authenticate, controller.getAll)

export default router;
