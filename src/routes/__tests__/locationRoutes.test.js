const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const locationRoutes = require('../locationRoutes');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');

// Mock auth middleware
jest.mock('../../middleware/authMiddleware', () => ({
    authenticateToken: (req, res, next) => {
        req.user = { _id: 'testUserId' };
        next();
    }
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/v1/locations', locationRoutes);

describe('Location Routes', () => {
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

    describe('GET /api/v1/locations/users', () => {
        it('should return 200 and list of users', async () => {
            // Create test user with location
            await User.create({
                username: 'testu',
                email: 'test@test.com',
                password: 'pass',
                location: { latitude: 10, longitude: 20, updatedAt: new Date() }
            });

            const res = await request(app).get('/api/v1/locations/users');

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveLength(1);
            expect(res.body.data[0].username).toBe('testu');
        });
    });

    describe('GET /api/v1/locations/history/:userId', () => {
        it('should return 200 and user history', async () => {
            const user = await User.create({
                username: 'history_user',
                email: 'history@test.com',
                password: 'pass',
                locationHistory: [
                    { latitude: 10, longitude: 20, timestamp: new Date() }
                ]
            });

            const res = await request(app).get(`/api/v1/locations/history/${user._id}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.history).toHaveLength(1);
        });
    });
});
