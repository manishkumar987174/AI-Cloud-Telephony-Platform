const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const Wallet = require('../models/Wallet');
const logger = require('../utils/logger');

// Generate JWT Helper
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, companyName } = req.body;

    if (!name || !email || !password || !companyName) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide name, email, password, and company name.' }
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: { message: 'User with this email already exists.' }
      });
    }

    // 1. Create the company
    const company = await Company.create({
      name: companyName,
      plan: 'free',
      wallet: 0 // starting balance in company settings
    });

    // 2. Create the company wallet
    await Wallet.create({
      companyId: company._id,
      balance: 100 // Give 100 free credits upon signup
    });

    // 3. Create the administrator user
    const user = await User.create({
      name,
      email,
      password,
      companyId: company._id,
      role: 'admin',
      isActive: true
    });

    // Remove password from output
    user.password = undefined;

    const token = generateToken(user._id);

    logger.info(`New user registered: ${email} for company ${companyName}`);

    res.status(201).json({
      success: true,
      token,
      data: {
        user,
        company
      }
    });
  } catch (error) {
    logger.error('Registration error: %s', error.message);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please provide email and password.' }
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' }
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' }
      });
    }

    // Check if active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: { message: 'Your account is suspended.' }
      });
    }

    // Fetch company info
    const company = await Company.findById(user.companyId);

    // Remove password
    user.password = undefined;

    const token = generateToken(user._id);

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      token,
      data: {
        user,
        company
      }
    });
  } catch (error) {
    logger.error('Login error: %s', error.message);
    next(error);
  }
};

exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('companyId');
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('GetCurrentUser error: %s', error.message);
    next(error);
  }
};

// Fallback method required by boilerplate
exports.getAll = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};
