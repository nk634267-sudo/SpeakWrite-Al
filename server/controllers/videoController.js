const videoService = require('../services/videoService');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc Evaluate video practice session
// @route POST /api/video/evaluate
const evaluateVideo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scenario, level, transcript, duration } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No speech transcript captured during your video session. Please record speaking and try again.'
      });
    }

    const session = await videoService.evaluateVideoSession(userId, {
      scenario,
      level,
      transcript,
      duration
    });

    // Update user practice time
    const addedMinutes = Math.max(1, Math.round((Number(duration) || 45) / 60));
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
      videoScore: session.scores.overallScore,
      speakingScore: session.scores.overallScore,
      confidenceScore: session.scores.confidence,
      grammarScore: session.scores.grammar,
      vocabularyScore: session.scores.vocabulary,
      overallScore: session.scores.overallScore,
      date: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Video practice evaluated successfully!',
      session
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get video history
// @route GET /api/video/history/:userId
const getHistory = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId || req.user.id;
    if (targetUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const history = await videoService.getUserVideoHistory(targetUserId);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  evaluateVideo,
  getHistory
};
