const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/get-profile', protect, getProfile);

module.exports = router;