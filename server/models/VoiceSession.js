const mongoose = require('mongoose');
const { isEmbedded } = require('../config/db');
const EmbeddedStore = require('../config/embeddedStore');

const voiceSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  scenario: { type: String, default: 'General Speaking' },
  transcript: { type: String, required: true },
  duration: { type: Number, default: 0 }, // in seconds
  scores: {
    fluency: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    vocabulary: { type: Number, default: 0 },
    pronunciation: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 }
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    fillerWords: [{
      word: String,
      count: Number
    }],
    paceWPM: Number,
    pronunciationTips: [String],
    grammarNotes: [String],
    vocabularyUpgrades: [{
      original: String,
      better: String
    }],
    recommendations: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

const MongooseVoice = mongoose.models.VoiceSession || mongoose.model('VoiceSession', voiceSessionSchema);

const VoiceSession = {
  async create(data) {
    if (isEmbedded()) {
      return EmbeddedStore.create('voiceSessions', data);
    }
    return MongooseVoice.create(data);
  },

  async find(filter = {}, options = { sort: { createdAt: -1 } }) {
    if (isEmbedded()) {
      return EmbeddedStore.find('voiceSessions', filter, options);
    }
    return MongooseVoice.find(filter).sort(options.sort || { createdAt: -1 });
  },

  async findById(id) {
    if (isEmbedded()) {
      return EmbeddedStore.findById('voiceSessions', id);
    }
    return MongooseVoice.findById(id);
  },

  async countDocuments(filter = {}) {
    if (isEmbedded()) {
      return EmbeddedStore.countDocuments('voiceSessions', filter);
    }
    return MongooseVoice.countDocuments(filter);
  }
};

module.exports = VoiceSession;
