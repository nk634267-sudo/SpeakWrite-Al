const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnected = false;
let useEmbeddedDb = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (uri && uri.trim() !== '') {
    try {
      console.log('Connecting to MongoDB at:', uri.split('@').pop());
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      isConnected = true;
      useEmbeddedDb = false;
      console.log('✅ Connected to MongoDB successfully.');
      return;
    } catch (err) {
      console.warn('⚠️ MongoDB connection failed:', err.message);
      console.log('🔄 Falling back to embedded persistent storage engine...');
    }
  } else {
    console.log('ℹ️ No MONGODB_URI provided. Initializing embedded persistent storage engine...');
  }

  useEmbeddedDb = true;
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const storePath = path.join(dataDir, 'store.json');
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify({
      users: [],
      writings: [],
      voiceSessions: [],
      videoSessions: [],
      progress: []
    }, null, 2));
  }
  console.log('✅ Embedded persistent storage ready at:', storePath);
};

const isEmbedded = () => useEmbeddedDb;

module.exports = { connectDB, isEmbedded };
