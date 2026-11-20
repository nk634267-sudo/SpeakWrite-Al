const express = require('express');
const router = express.Router();
const {
  getProgressSummary,
  getProgressHistory
} = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getProgressSummary);
router.get('/history', protect, getProgressHistory);

module.exports = router;
