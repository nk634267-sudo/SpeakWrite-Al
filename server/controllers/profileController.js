const User = require('../models/User');

// @desc Get user profile
// @route GET /api/profile
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      profile: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        englishLevel: user.englishLevel,
        goals: user.goals || [],
        dailyGoal: user.dailyGoal || 20,
        difficulties: user.difficulties || [],
        streak: user.streak || 1,
        totalPracticeTime: user.totalPracticeTime || 0,
        settings: user.settings || {
          voiceAccent: 'alloy',
          speechRate: 1.0,
          notificationsEnabled: true
        },
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user profile & settings
// @route PUT /api/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, englishLevel, dailyGoal, goals, difficulties, settings } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (englishLevel) updates.englishLevel = englishLevel;
    if (dailyGoal) updates.dailyGoal = Number(dailyGoal);
    if (goals) updates.goals = goals;
    if (difficulties) updates.difficulties = difficulties;
    if (settings) updates.settings = settings;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      profile: {
        id: updatedUser._id || updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        englishLevel: updatedUser.englishLevel,
        goals: updatedUser.goals,
        dailyGoal: updatedUser.dailyGoal,
        difficulties: updatedUser.difficulties,
        streak: updatedUser.streak,
        totalPracticeTime: updatedUser.totalPracticeTime,
        settings: updatedUser.settings
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile
};
