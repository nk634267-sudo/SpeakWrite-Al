const mongoose = require('mongoose');
const { isEmbedded } = require('../config/db');
const EmbeddedStore = require('../config/embeddedStore');

const writingSubmissionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  topic: { type: String, required: true },
  category: { type: String, default: 'Essay' },
  difficulty: { type: String, default: 'Intermediate' },
  timeLimit: { type: Number, required: true }, // in seconds
  timeUsed: { type: Number, required: true },  // in seconds
  answer: { type: String, required: true },
  wordCount: { type: Number, default: 0 },
  score: { type: Number, required: true }, // overall weighted score 0-100
  scores: {
    grammar: { type: Number, default: 0 },
    vocabulary: { type: Number, default: 0 },
    sentenceStructure: { type: Number, default: 0 },
    clarity: { type: Number, default: 0 },
    organization: { type: Number, default: 0 },
    spelling: { type: Number, default: 0 }
  },
  feedback: {
    overallScore: Number,
    grammar: Number,
    vocabulary: Number,
    sentenceStructure: Number,
    clarity: Number,
    organization: Number,
    spelling: Number,
    strengths: [String],
    weaknesses: [String],
    mistakes: [{
      original: String,
      correction: String,
      explanation: String,
      category: String
    }],
    vocabularySuggestions: [{
      original: String,
      suggestion: String,
      explanation: String,
      example: String
    }],
    practiceRecommendations: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

const MongooseWriting = mongoose.models.WritingSubmission || mongoose.model('WritingSubmission', writingSubmissionSchema);

const WritingSubmission = {
  async create(data) {
    if (isEmbedded()) {
      return EmbeddedStore.create('writings', data);
    }
    return MongooseWriting.create(data);
  },

  async find(filter = {}, options = { sort: { createdAt: -1 } }) {
    if (isEmbedded()) {
      return EmbeddedStore.find('writings', filter, options);
    }
    return MongooseWriting.find(filter).sort(options.sort || { createdAt: -1 });
  },

  async findById(id) {
    if (isEmbedded()) {
      return EmbeddedStore.findById('writings', id);
    }
    return MongooseWriting.findById(id);
  },

  async countDocuments(filter = {}) {
    if (isEmbedded()) {
      return EmbeddedStore.countDocuments('writings', filter);
    }
    return MongooseWriting.countDocuments(filter);
  }
};

module.exports = WritingSubmission;
