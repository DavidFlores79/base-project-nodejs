const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const user = await User.findById(req.user._id);

        if (user) {
            user.location = {
                latitude,
                longitude,
                updatedAt: new Date()
            };
            await user.save();
            
            // Broadcast location via socket
            if (req.io) {
                req.io.emit('user_location_updated', {
                    userId: user._id,
                    username: user.username,
                    location: user.location
                });
            }

            res.json({ message: 'Location updated successfully', location: user.location });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProfile,
    updateLocation
};
