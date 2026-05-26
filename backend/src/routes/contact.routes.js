import { Router } from 'express';
import * as controller from '../controllers/contact.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// TODO: Add contact routes
// router.get('/', authenticate, controller.getAll)

export default router;
