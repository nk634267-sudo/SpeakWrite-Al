const writingService = require('../services/writingService');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc Generate a practice topic
// @route POST /api/writing/topic
const generateTopic = async (req, res, next) => {
  try {
    const { category, difficulty } = req.body;
    const topicData = await writingService.getTopic(category, difficulty);
    res.json({ success: true, ...topicData });
  } catch (error) {
    next(error);
  }
};

// @desc Submit writing and receive AI evaluation
// @route POST /api/writing/submit
const submitWriting = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { topic, category, difficulty, timeLimit, timeUsed, answer } = req.body;

    if (!answer || answer.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Writing submission cannot be empty. Please write a response before submitting.'
      });
    }

    const submission = await writingService.processSubmission(userId, {
      topic,
      category,
      difficulty,
      timeLimit,
      timeUsed,
      answer
    });

    // Update user's practice time
    const addedMinutes = Math.max(1, Math.round((Number(timeUsed) || 60) / 60));
    const user = await User.findById(userId);
    if (user) {
      await User.findByIdAndUpdate(userId, {
        totalPracticeTime: (user.totalPracticeTime || 0) + addedMinutes,
        lastPracticeDate: new Date().toISOString()
      });
    }

    // Record progress snapshot
    await Progress.create({
      userId,
      writingScore: submission.score,
      grammarScore: submission.scores.grammar,
      vocabularyScore: submission.scores.vocabulary,
      overallScore: submission.score,
      date: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Writing evaluated successfully!',
      submission
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get writing history
// @route GET /api/writing/history/:userId
const getHistory = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId || req.user.id;
    // ensure users only see their own history
    if (targetUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const history = await writingService.getUserWritingHistory(targetUserId);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateTopic,
  submitWriting,
  getHistory
};
