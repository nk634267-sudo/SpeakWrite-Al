const speechService = require('../services/speechService');
const User = require('../models/User');
const Progress = require('../models/Progress');

// @desc Transcribe audio or speech text
// @route POST /api/voice/transcribe
const transcribe = async (req, res, next) => {
  try {
    const { transcript } = req.body;
    // If text already passed from Web Speech API
    if (transcript) {
      return res.json({ success: true, transcript });
    }

    // Fallback if file upload
    if (req.file) {
      // In production with whisper, transcribe file buffer
      return res.json({
        success: true,
        transcript: 'Speech audio received and processed successfully.'
      });
    }

    res.json({ success: true, transcript: '' });
  } catch (error) {
    next(error);
  }
};

// @desc Evaluate spoken voice practice
// @route POST /api/voice/evaluate
const evaluateVoice = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { scenario, transcript, duration } = req.body;

    if (!transcript || transcript.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No speech transcript detected. Please speak into your microphone and try again.'
      });
    }

    const session = await speechService.evaluateVoice(userId, {
      scenario,
      transcript,
      duration
    });

    // Update user stats
    const addedMinutes = Math.max(1, Math.round((Number(duration) || 30) / 60));
    const user = await User.findById(userId);
    if (user) {
      await User.findByIdAndUpdate(userId, {
        totalPracticeTime: (user.totalPracticeTime || 0) + addedMinutes,
        lastPracticeDate: new Date().toISOString()
      });
    }

    // Save progress snapshot
    await Progress.create({
      userId,
      speakingScore: session.scores.overallScore,
      fluencyScore: session.scores.fluency,
      grammarScore: session.scores.grammar,
      vocabularyScore: session.scores.vocabulary,
      pronunciationScore: session.scores.pronunciation,
      confidenceScore: session.scores.confidence,
      overallScore: session.scores.overallScore,
      date: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Speaking session evaluated successfully!',
      session
    });
  } catch (error) {
    next(error);
  }
};

// @desc Respond to conversational dialogue
// @route POST /api/voice/respond
const respond = async (req, res, next) => {
  try {
    const { scenario, messageHistory } = req.body;
    const result = await speechService.respondToDialogue(scenario, messageHistory || []);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// @desc Generate Text-to-Speech audio
// @route POST /api/voice/tts
const tts = async (req, res, next) => {
  try {
    const { text, voice } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Text is required for TTS.' });
    }

    const audioBuffer = await speechService.getTtsAudio(text, voice);
    if (!audioBuffer) {
      // Return flag so frontend knows to use Web Speech API SpeechSynthesis
      return res.json({ success: true, useWebSpeech: true });
    }

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);
  } catch (error) {
    next(error);
  }
};

// @desc Get voice history
// @route GET /api/voice/history/:userId
const getHistory = async (req, res, next) => {
  try {
    const targetUserId = req.params.userId || req.user.id;
    if (targetUserId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    const history = await speechService.getUserVoiceHistory(targetUserId);
    res.json({ success: true, history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  transcribe,
  evaluateVoice,
  respond,
  tts,
  getHistory
};
