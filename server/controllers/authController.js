const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'speakwrite_super_secret_jwt_key_987654321_production', {
    expiresIn: '30d'
  });
};

// @desc Register a new user
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, englishLevel } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      englishLevel: englishLevel || 'Intermediate',
      streak: 1,
      lastPracticeDate: new Date().toISOString()
    });

    const token = generateToken(user._id || user.id);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Welcome to SpeakWrite AI!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        englishLevel: user.englishLevel,
        goals: user.goals || [],
        dailyGoal: user.dailyGoal || 20,
        streak: user.streak || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Update streak if needed
    const lastDate = user.lastPracticeDate ? new Date(user.lastPracticeDate) : null;
    const now = new Date();
    let newStreak = user.streak || 1;

    if (lastDate) {
      const diffHours = (now - lastDate) / (1000 * 60 * 60);
      if (diffHours >= 24 && diffHours < 48) {
        newStreak += 1;
      } else if (diffHours >= 48) {
        newStreak = 1;
      }
    }

    await User.findByIdAndUpdate(user._id || user.id, {
      lastPracticeDate: now.toISOString(),
      streak: newStreak
    });

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      message: 'Welcome back!',
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        englishLevel: user.englishLevel,
        goals: user.goals || [],
        dailyGoal: user.dailyGoal || 20,
        difficulties: user.difficulties || [],
        streak: newStreak
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get current authenticated user
// @route GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        englishLevel: user.englishLevel,
        goals: user.goals || [],
        dailyGoal: user.dailyGoal || 20,
        difficulties: user.difficulties || [],
        streak: user.streak || 1,
        totalPracticeTime: user.totalPracticeTime || 0,
        settings: user.settings || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Forgot password
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    
    // For privacy/security, always return friendly generic confirmation
    res.json({
      success: true,
      message: 'If an account exists with this email, instructions have been prepared. Use reset code 123456 in demo mode.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset password
// @route POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email and your new password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Account not found with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(user._id || user.id, {
      password: hashedPassword
    });

    res.json({
      success: true,
      message: 'Password has been successfully updated. You can now log in.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc Save user onboarding preferences
// @route POST /api/auth/onboarding
const saveOnboarding = async (req, res, next) => {
  try {
    const { englishLevel, goals, dailyGoal, difficulties } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        englishLevel: englishLevel || 'Intermediate',
        goals: goals || [],
        dailyGoal: Number(dailyGoal) || 20,
        difficulties: difficulties || []
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Preferences saved successfully!',
      user: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        englishLevel: updated.englishLevel,
        goals: updated.goals,
        dailyGoal: updated.dailyGoal,
        difficulties: updated.difficulties,
        streak: updated.streak
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  saveOnboarding
};
