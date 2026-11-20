const mongoose = require('mongoose');
const { isEmbedded } = require('../config/db');
const EmbeddedStore = require('../config/embeddedStore');

const videoSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  scenario: { type: String, required: true },
  level: { type: Number, default: 1 }, // 1 to 4
  duration: { type: Number, default: 0 }, // in seconds
  transcript: { type: String, required: true },
  scores: {
    communication: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    grammar: { type: Number, default: 0 },
    vocabulary: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 }
  },
  feedback: {
    strengths: [String],
    weaknesses: [String],
    fillerWords: [{
      word: String,
      count: Number
    }],
    pacingAnalysis: String,
    stageFearTips: [String],
    bodyLanguageAdvice: [String],
    recommendations: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

const MongooseVideo = mongoose.models.VideoSession || mongoose.model('VideoSession', videoSessionSchema);

const VideoSession = {
  async create(data) {
    if (isEmbedded()) {
      return EmbeddedStore.create('videoSessions', data);
    }
    return MongooseVideo.create(data);
  },

  async find(filter = {}, options = { sort: { createdAt: -1 } }) {
    if (isEmbedded()) {
      return EmbeddedStore.find('videoSessions', filter, options);
    }
    return MongooseVideo.find(filter).sort(options.sort || { createdAt: -1 });
  },

  async findById(id) {
    if (isEmbedded()) {
      return EmbeddedStore.findById('videoSessions', id);
    }
    return MongooseVideo.findById(id);
  },

  async countDocuments(filter = {}) {
    if (isEmbedded()) {
      return EmbeddedStore.countDocuments('videoSessions', filter);
    }
    return MongooseVideo.countDocuments(filter);
  }
};

module.exports = VideoSession;
