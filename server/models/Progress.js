const mongoose = require('mongoose');
const { isEmbedded } = require('../config/db');
const EmbeddedStore = require('../config/embeddedStore');

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  writingScore: { type: Number, default: 0 },
  grammarScore: { type: Number, default: 0 },
  vocabularyScore: { type: Number, default: 0 },
  speakingScore: { type: Number, default: 0 },
  fluencyScore: { type: Number, default: 0 },
  pronunciationScore: { type: Number, default: 0 },
  confidenceScore: { type: Number, default: 0 },
  videoScore: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  date: { type: Date, default: Date.now }
});

const MongooseProgress = mongoose.models.Progress || mongoose.model('Progress', progressSchema);

const Progress = {
  async create(data) {
    if (isEmbedded()) {
      return EmbeddedStore.create('progress', data);
    }
    return MongooseProgress.create(data);
  },

  async find(filter = {}, options = { sort: { date: 1 } }) {
    if (isEmbedded()) {
      return EmbeddedStore.find('progress', filter, options);
    }
    return MongooseProgress.find(filter).sort(options.sort || { date: 1 });
  },

  async findOne(filter = {}, options = { sort: { date: -1 } }) {
    if (isEmbedded()) {
      const items = EmbeddedStore.find('progress', filter, options);
      return items.length > 0 ? items[0] : null;
    }
    return MongooseProgress.findOne(filter).sort(options.sort || { date: -1 });
  }
};

module.exports = Progress;
