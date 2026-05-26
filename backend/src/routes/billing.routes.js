import { Router } from 'express';
import * as controller from '../controllers/billing.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add billing routes
// router.get('/', authenticate, controller.getAll)

export default router;
