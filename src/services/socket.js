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

                // Broadcast to all connected clients
                io.emit('user_location_updated', {
                    userId: user._id,
                    username: user.username,
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