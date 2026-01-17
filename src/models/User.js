const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: String,
    lastName: String,
    avatar: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: { type: String, default: 'México' },
        postalCode: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    location: {
        latitude: Number,
        longitude: Number,
        updatedAt: Date
    },
    locationHistory: [{
        latitude: Number,
        longitude: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    // Manage location history limits if it was modified
    if (this.isModified('location') && this.location.latitude && this.location.longitude) {
        if (!this.locationHistory) {
            this.locationHistory = [];
        }
        
        // Add current location to history
        this.locationHistory.push({
            latitude: this.location.latitude,
            longitude: this.location.longitude,
            timestamp: this.location.updatedAt || new Date()
        });

        // Keep only last 50 entries
        if (this.locationHistory.length > 50) {
            this.locationHistory = this.locationHistory.slice(-50);
        }
    }

    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
