const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/me', authenticate, controller.getCurrentUser);

// Fallback compatibility route
router.get('/', authenticate, controller.getAll);

module.exports = router;
