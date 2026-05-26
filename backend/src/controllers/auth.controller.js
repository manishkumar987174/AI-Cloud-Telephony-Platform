const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const logger = require('../utils/logger');

// Generate JWT Helper
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId.toString() }, // Convert BigInt to string for signing
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
    const userExists = await prisma.user.findUnique({
      where: { email }
    });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: { message: 'User with this email already exists.' }
      });
    }

    // Execute transactional signup
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the company
      const company = await tx.company.create({
        data: {
          name: companyName,
          plan: 'free',
          walletBalance: 0.00
        }
      });

      // 2. Create the company wallet
      await tx.wallet.create({
        data: {
          companyId: company.id,
          balance: 100.00 // Promotional credit
        }
      });

      // 3. Hash the password
      const hashedPassword = await bcrypt.hash(password, 12);

      // 4. Create the administrator user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          companyId: company.id,
          role: 'admin',
          isActive: true
        }
      });

      return { user, company };
    });

    // Remove password hash from response
    delete result.user.password;

    const token = generateToken(result.user.id);

    logger.info(`New user registered via MySQL/Prisma: ${email} for company ${companyName}`);

    res.status(201).json({
      success: true,
      token,
      data: {
        user: result.user,
        company: result.company
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

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' }
      });
    }

    // Check if password matches (bcrypt comparison since models don't auto-compare anymore)
    const isMatch = await bcrypt.compare(password, user.password);
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
    const company = await prisma.company.findUnique({
      where: { id: user.companyId }
    });

    // Remove password hash
    delete user.password;

    const token = generateToken(user.id);

    logger.info(`User logged in via MySQL/Prisma: ${email}`);

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
    const user = await prisma.user.findUnique({
      where: { id: BigInt(req.user.id) },
      include: {
        company: true
      }
    });

    if (user) {
      delete user.password;
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    logger.error('GetCurrentUser error: %s', error.message);
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    next(error);
  }
};
