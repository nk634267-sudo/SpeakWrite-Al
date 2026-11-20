const express = require('express');
const router = express.Router();
const {
  evaluateVideo,
  getHistory
} = require('../controllers/videoController');
const { protect } = require('../middleware/authMiddleware');

router.post('/session', protect, (req, res) => {
  res.json({ success: true, message: 'Video session initialized.' });
});
router.post('/evaluate', protect, evaluateVideo);
router.get('/history/:userId', protect, getHistory);

module.exports = router;
