const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getTaskStats, getTaskTrends } = require('../controllers/analyticsController');

router.get('/stats', protect, getTaskStats);
router.get('/trends', protect, getTaskTrends);

module.exports = router;
