import { Router } from 'express';
import * as controller from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add analytics routes
// router.get('/', authenticate, controller.getAll)

export default router;
