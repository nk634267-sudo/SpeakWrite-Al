const VideoSession = require('../models/VideoSession');
const openaiService = require('./openaiService');

const evaluateVideoSession = async (userId, data) => {
  const { scenario, level, transcript, duration } = data;
  const feedback = await openaiService.evaluateVideo(
    scenario || 'Communication Simulation',
    Number(level) || 1,
    transcript || '',
    Number(duration) || 45
  );

  const session = await VideoSession.create({
    userId,
    scenario: scenario || 'Communication Simulation',
    level: Number(level) || 1,
    duration: Number(duration) || 45,
    transcript: transcript || '',
    scores: {
      communication: feedback.communication,
      clarity: feedback.clarity,
      grammar: feedback.grammar,
      vocabulary: feedback.vocabulary,
      confidence: feedback.confidence,
      relevance: feedback.relevance,
      overallScore: feedback.overallScore
    },
    feedback
  });

  return session;
};

const getUserVideoHistory = async (userId) => {
  return VideoSession.find({ userId });
};

module.exports = {
  evaluateVideoSession,
  getUserVideoHistory
};
