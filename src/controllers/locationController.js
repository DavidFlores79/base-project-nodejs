const User = require('../models/User');

/**
 * Get all users with their current locations
 * @route GET /api/v1/locations/users
 */
const getAllUsersLocations = async (req, res) => {
    try {
        // Find all users who have a location set
        const users = await User.find({
            'location.latitude': { $exists: true },
            'location.longitude': { $exists: true },
            isActive: true
        }).select('-password -locationHistory');

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users locations:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch users locations' 
        });
    }
};

/**
 * Get location history for a specific user
 * @route GET /api/v1/locations/history/:userId
 */
const getUserLocationHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId)
            .select('username firstName lastName avatar locationHistory');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                error: 'User not found' 
            });
        }

        res.json({
            success: true,
            data: {
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                history: user.locationHistory || []
            }
        });
    } catch (error) {
        console.error('Error fetching user location history:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch location history' 
        });
    }
};

module.exports = {
    getAllUsersLocations,
    getUserLocationHistory
};
