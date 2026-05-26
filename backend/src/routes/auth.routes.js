import { Router } from 'express';
import * as controller from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.getCurrentUser);

// Fallback compatibility route
router.get('/', authenticate, controller.getAll);

export default router;
