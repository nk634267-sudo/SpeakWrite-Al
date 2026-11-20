const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database (MongoDB or fallback embedded store)
connectDB();

// Middleware - allow localhost, LAN IP, and mobile devices
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'SpeakWrite AI Server',
    time: new Date().toISOString(),
    aiEngine: process.env.OPENAI_API_KEY ? 'OpenAI GPT-4o' : 'Intelligent Mock Engine'
  });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/writing', require('./routes/writingRoutes'));
app.use('/api/voice', require('./routes/voiceRoutes'));
app.use('/api/video', require('./routes/videoRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));

// 404 & Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 SpeakWrite AI Server running on port ${PORT}`);
    console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;
