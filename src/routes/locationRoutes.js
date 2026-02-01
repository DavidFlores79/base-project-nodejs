const express = require('express');
const router = express.Router();
const { getAllUsersLocations, getUserLocationHistory } = require('../controllers/locationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/users', authenticateToken, getAllUsersLocations);
router.get('/history/:userId', authenticateToken, getUserLocationHistory);

module.exports = router;
