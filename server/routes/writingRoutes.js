const express = require('express');
const router = express.Router();
const {
  generateTopic,
  submitWriting,
  getHistory
} = require('../controllers/writingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/topic', protect, generateTopic);
router.post('/submit', protect, submitWriting);
router.post('/evaluate', protect, submitWriting);
router.get('/history/:userId', protect, getHistory);

module.exports = router;
