const mongoose = require('mongoose');
const User = require('../User');
const { MongoMemoryServer } = require('mongodb-memory-server');

describe('User Model', () => {
    let mongoServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        await mongoose.connect(mongoServer.getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should limit location history to 50 entries', async () => {
        const user = await User.create({
            username: 'history_test',
            email: 'history@test.com',
            password: 'pass',
            location: { latitude: 0, longitude: 0, updatedAt: new Date() }
        });

        // Add 55 locations
        for (let i = 0; i < 55; i++) {
            user.location = {
                latitude: i,
                longitude: i,
                updatedAt: new Date()
            };
            await user.save();
        }

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.locationHistory.length).toBe(50);
        // Should have latest entries (indices 5-54)
        expect(updatedUser.locationHistory[49].latitude).toBe(54);
    });
});
