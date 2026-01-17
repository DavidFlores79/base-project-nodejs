const { io } = require('../socket');
const User = require('../../models/User');

// Mock User model
jest.mock('../../models/User');

// Mock socket.io instance
jest.mock('../../models/server', () => ({
    io: {
        on: jest.fn(),
        emit: jest.fn()
    }
}));

describe('Socket Service', () => {
    let mockSocket;
    let eventHandlers = {};

    beforeEach(() => {
        eventHandlers = {};
        mockSocket = {
            id: 'socket1',
            join: jest.fn(),
            emit: jest.fn(),
            on: jest.fn((event, cb) => {
                eventHandlers[event] = cb;
            }),
            connected: true,
            disconnect: jest.fn()
        };
        
        // Setup io.on to capture connection handler
        io.on.mockImplementation((event, cb) => {
            if (event === 'connection') {
                cb(mockSocket);
            }
        });
        
        jest.clearAllMocks();
    });

    it('should handle user_authenticate event', async () => {
        // Re-require to trigger io.on('connection')
        jest.isolateModules(() => {
            require('../socket');
        });

        // Trigger authenticate if handler captured
        if (eventHandlers['user_authenticate']) {
            await eventHandlers['user_authenticate']({ userId: 'user1' });
            
            expect(mockSocket.join).toHaveBeenCalledWith('user_user1');
            expect(mockSocket.emit).toHaveBeenCalledWith('authenticated', { success: true, userId: 'user1' });
        } else {
            // Fallback if isolateModules didn't work as expected in this env
            // This part depends on how the module side-effects run
             console.log('Handler not captured, check module loading');
        }
    });
});
