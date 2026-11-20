const WritingSubmission = require('../models/WritingSubmission');
const openaiService = require('./openaiService');

const getTopic = async (category, difficulty) => {
  return openaiService.generateWritingTopic(category, difficulty);
};

const processSubmission = async (userId, data) => {
  const { topic, category, difficulty, timeLimit, timeUsed, answer } = data;
  const wordCount = (answer || '').trim().split(/\s+/).filter(Boolean).length;

  // AI evaluation
  const feedback = await openaiService.evaluateWriting(topic, answer, category, difficulty);

  // Save submission
  const submission = await WritingSubmission.create({
    userId,
    topic,
    category: category || 'Essay',
    difficulty: difficulty || 'Intermediate',
    timeLimit: Number(timeLimit) || 300,
    timeUsed: Number(timeUsed) || 300,
    answer,
    wordCount,
    score: feedback.overallScore,
    scores: {
      grammar: feedback.grammar,
      vocabulary: feedback.vocabulary,
      sentenceStructure: feedback.sentenceStructure,
      clarity: feedback.clarity,
      organization: feedback.organization,
      spelling: feedback.spelling
    },
    feedback
  });

  return submission;
};

const getUserWritingHistory = async (userId) => {
  return WritingSubmission.find({ userId });
};

module.exports = {
  getTopic,
  processSubmission,
  getUserWritingHistory
};
