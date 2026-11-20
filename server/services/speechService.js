const VoiceSession = require('../models/VoiceSession');
const openaiService = require('./openaiService');
const fs = require('fs');

const evaluateVoice = async (userId, data) => {
  const { scenario, transcript, duration } = data;
  const feedback = await openaiService.evaluateSpeaking(scenario, transcript, Number(duration) || 30);

  const session = await VoiceSession.create({
    userId,
    scenario: scenario || 'General Speaking',
    transcript: transcript || '',
    duration: Number(duration) || 30,
    scores: {
      fluency: feedback.fluency,
      grammar: feedback.grammar,
      vocabulary: feedback.vocabulary,
      pronunciation: feedback.pronunciation,
      confidence: feedback.confidence,
      overallScore: feedback.overallScore
    },
    feedback
  });

  return session;
};

const respondToDialogue = async (scenario, messageHistory) => {
  return openaiService.generateConversationReply(scenario, messageHistory);
};

const getTtsAudio = async (text, voice) => {
  return openaiService.textToSpeech(text, voice);
};

const getUserVoiceHistory = async (userId) => {
  return VoiceSession.find({ userId });
};

module.exports = {
  evaluateVoice,
  respondToDialogue,
  getTtsAudio,
  getUserVoiceHistory
};
