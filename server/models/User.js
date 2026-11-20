const mongoose = require('mongoose');
const { isEmbedded } = require('../config/db');
const EmbeddedStore = require('../config/embeddedStore');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  englishLevel: { 
    type: String, 
    enum: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced'],
    default: 'Intermediate' 
  },
  goals: { type: [String], default: ['Writing', 'Speaking', 'Confidence'] },
  dailyGoal: { type: Number, default: 20 }, // in minutes
  difficulties: { type: [String], default: [] },
  streak: { type: Number, default: 1 },
  lastPracticeDate: { type: Date, default: Date.now },
  totalPracticeTime: { type: Number, default: 0 },
  settings: {
    voiceAccent: { type: String, default: 'alloy' },
    speechRate: { type: Number, default: 1.0 },
    notificationsEnabled: { type: Boolean, default: true },
    targetDailyMinutes: { type: Number, default: 20 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

const User = {
  async create(data) {
    if (isEmbedded()) {
      return EmbeddedStore.create('users', data);
    }
    return MongooseUser.create(data);
  },

  async findOne(filter) {
    if (isEmbedded()) {
      return EmbeddedStore.findOne('users', filter);
    }
    return MongooseUser.findOne(filter);
  },

  async findById(id) {
    if (isEmbedded()) {
      return EmbeddedStore.findById('users', id);
    }
    return MongooseUser.findById(id);
  },

  async find(filter, options) {
    if (isEmbedded()) {
      return EmbeddedStore.find('users', filter, options);
    }
    return MongooseUser.find(filter);
  },

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    if (isEmbedded()) {
      return EmbeddedStore.findByIdAndUpdate('users', id, updates);
    }
    return MongooseUser.findByIdAndUpdate(id, updates, options);
  }
};

module.exports = User;
