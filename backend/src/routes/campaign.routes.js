import { Router } from 'express';
import * as controller from '../controllers/campaign.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add campaign routes
// router.get('/', authenticate, controller.getAll)

export default router;
