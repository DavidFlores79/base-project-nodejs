const { getAllUsersLocations, getUserLocationHistory } = require('../locationController');
const User = require('../../models/User');

// Mock User model
jest.mock('../../models/User');

describe('Location Controller', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            params: {},
            body: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    describe('getAllUsersLocations', () => {
        it('should return all active users with locations', async () => {
            const mockUsers = [
                {
                    _id: 'user1',
                    username: 'user1',
                    location: { latitude: 10, longitude: 20 }
                }
            ];

            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUsers)
            });

            await getAllUsersLocations(mockReq, mockRes);

            expect(User.find).toHaveBeenCalledWith({
                'location.latitude': { $exists: true },
                'location.longitude': { $exists: true },
                isActive: true
            });
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                count: 1,
                data: mockUsers
            });
        });

        it('should handle errors gracefully', async () => {
            User.find.mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error('DB Error'))
            });

            await getAllUsersLocations(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'Failed to fetch users locations'
            });
        });
    });

    describe('getUserLocationHistory', () => {
        it('should return history for existing user', async () => {
            mockReq.params.userId = 'user1';
            const mockUser = {
                _id: 'user1',
                username: 'user1',
                locationHistory: [
                    { latitude: 10, longitude: 20, timestamp: new Date() }
                ]
            };

            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockUser)
            });

            await getUserLocationHistory(mockReq, mockRes);

            expect(User.findById).toHaveBeenCalledWith('user1');
            expect(mockRes.json).toHaveBeenCalledWith({
                success: true,
                data: expect.objectContaining({
                    userId: 'user1',
                    history: mockUser.locationHistory
                })
            });
        });

        it('should return 404 for non-existent user', async () => {
            mockReq.params.userId = 'user1';
            User.findById.mockReturnValue({
                select: jest.fn().mockResolvedValue(null)
            });

            await getUserLocationHistory(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });
    });
});
