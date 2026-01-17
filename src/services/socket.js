const { io } = require('../models/server');
const User = require('../models/User');

// Sockets
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // User authentication (join user room)
    socket.on('user_authenticate', async (data) => {
        const { userId } = data;
        if (userId) {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined room user_${userId}`);
            
            // Mark user as active/online if needed
            socket.emit('authenticated', { success: true, userId });
        }
    });

    // Send all users' locations on request
    socket.on('get_all_locations', async () => {
        try {
            const users = await User.find({
                'location.latitude': { $exists: true },
                'location.longitude': { $exists: true },
                isActive: true
            }).select('-password -locationHistory');

            socket.emit('all_locations', {
                success: true,
                users: users.map(u => ({
                    userId: u._id,
                    username: u.username,
                    firstName: u.firstName,
                    lastName: u.lastName,
                    avatar: u.avatar,
                    location: u.location
                }))
            });
        } catch (error) {
            console.error('Error fetching all locations:', error);
            socket.emit('all_locations', { success: false, error: 'Failed to fetch locations' });
        }
    });

    // Handle location updates from client
    socket.on('update_location', async (data) => {
        const { userId, latitude, longitude } = data;
        
        try {
            const user = await User.findById(userId);
            if (user) {
                user.location = {
                    latitude,
                    longitude,
                    updatedAt: new Date()
                };

                await user.save();

                // Broadcast to all connected clients with full user info
                io.emit('user_location_updated', {
                    userId: user._id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    location: user.location
                });
            }
        } catch (error) {
            console.error('Error updating location via socket:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

console.log('Socket.io events initialized');

module.exports = { io };