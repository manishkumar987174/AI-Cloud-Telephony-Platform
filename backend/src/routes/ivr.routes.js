import { Router } from 'express';
import * as controller from '../controllers/ivr.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add ivr routes
// router.get('/', authenticate, controller.getAll)

export default router;
