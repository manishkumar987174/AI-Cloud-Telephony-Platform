const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Not authorized, token missing' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this');

    const user = await User.findById(decoded.id).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'User no longer exists' }
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: { message: 'This user account is suspended' }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication middleware error: %s', error.message);
    return res.status(401).json({
      success: false,
      error: { message: 'Not authorized, invalid token' }
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Forbidden, insufficient permissions' }
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
