const express = require('express');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validate');
const { validatePregnancyData } = require('../utils/pregnancyUtils');

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('name')
    .trim()
    .customSanitizer((v) => (v === '' ? undefined : v))
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .customSanitizer((v) => (v === '' ? undefined : v))
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('phone')
    .optional({ nullable: true })
    .customSanitizer(v => v === '' ? undefined : v)
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  body('age')
    .optional({ nullable: true })
    .customSanitizer(v => v === '' ? undefined : v)
    .toInt()
    .isInt({ min: 13, max: 100 })
    .withMessage('Age must be between 13 and 100'),
  body('isPregnant')
    .optional({ nullable: true })
    .customSanitizer((v) => {
      if (typeof v === 'string') {
        if (v === 'on' || v === 'true' || v === '1') return true;
        if (v === 'off' || v === 'false' || v === '0' || v === '') return false;
      }
      return v;
    })
    .toBoolean()
    .isBoolean()
    .withMessage('isPregnant must be a boolean'),
  body('pregnancyStartDate')
    .optional({ nullable: true })
    .customSanitizer(v => v === '' ? undefined : v)
    .toDate()
    .isISO8601()
    .withMessage('Please enter a valid date'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Check if MongoDB is available
    if (!User || !User.findByEmail) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }

    const {
      name,
      email,
      password,
      phone,
      age,
      isPregnant,
      pregnancyStartDate
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Validate and calculate pregnancy data
    const pregnancyValidation = validatePregnancyData({
      isPregnant,
      pregnancyStartDate
    });

    if (!pregnancyValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: pregnancyValidation.error
      });
    }

    const { dueDate, currentWeek } = pregnancyValidation.data;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      age,
      isPregnant,
      pregnancyStartDate,
      dueDate,
      currentWeek
    });

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    // Check if MongoDB is available
    if (!User || !User.findByEmail) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }

    const { email, password } = req.body;

    // Find user by email and include password for comparison
    const user = await User.findByEmail(email).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: user.getProfile()
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // Check if it's a MongoDB connection error
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        success: false,
        message: 'Database service unavailable. Please try again later.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  protect,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .matches(/^\+?[\d\s-()]+$/)
    .withMessage('Please enter a valid phone number'),
  body('age')
    .optional()
    .isInt({ min: 13, max: 100 })
    .withMessage('Age must be between 13 and 100'),
  body('isPregnant')
    .optional()
    .isBoolean()
    .withMessage('isPregnant must be a boolean'),
  body('pregnancyStartDate')
    .optional()
    .isISO8601()
    .withMessage('Please enter a valid date'),
  body('preferences.language')
    .optional()
    .isIn(['rw', 'en', 'fr'])
    .withMessage('Language must be rw, en, or fr'),
  body('preferences.notifications')
    .optional()
    .isBoolean()
    .withMessage('Notifications must be a boolean'),
  handleValidationErrors
], async (req, res) => {
  try {
    const {
      name,
      phone,
      age,
      isPregnant,
      pregnancyStartDate,
      preferences
    } = req.body;

    // Validate and calculate pregnancy data if changed
    let dueDate = req.user.dueDate;
    let currentWeek = req.user.currentWeek;
    
    if (isPregnant !== undefined && isPregnant !== req.user.isPregnant) {
      const pregnancyValidation = validatePregnancyData({
        isPregnant,
        pregnancyStartDate
      });

      if (!pregnancyValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: pregnancyValidation.error
        });
      }

      ({ dueDate, currentWeek } = pregnancyValidation.data);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name,
        phone,
        age,
        isPregnant,
        pregnancyStartDate,
        dueDate,
        currentWeek,
        preferences: { ...req.user.preferences, ...preferences }
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', protect, async (req, res) => {
  try {
    // In a more advanced setup, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

module.exports = router;
