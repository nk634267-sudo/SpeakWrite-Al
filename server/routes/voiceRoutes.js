const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  transcribe,
  evaluateVoice,
  respond,
  tts,
  getHistory
} = require('../controllers/voiceController');
const { protect } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

router.post('/transcribe', protect, upload.single('audio'), transcribe);
router.post('/evaluate', protect, evaluateVoice);
router.post('/respond', protect, respond);
router.post('/tts', protect, tts);
router.get('/history/:userId', protect, getHistory);

module.exports = router;
