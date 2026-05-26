import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add user routes
// router.get('/', authenticate, controller.getAll)

export default router;
