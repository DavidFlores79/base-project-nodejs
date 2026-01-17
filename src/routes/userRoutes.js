const express = require('express');
const router = express.Router();
const { getProfile, updateLocation } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/profile', authenticateToken, getProfile);
router.post('/location', authenticateToken, updateLocation);

module.exports = router;
