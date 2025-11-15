// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { 
        type: String, 
        required: true 
    },
    displayName: { 
        type: String, 
        required: true 
    },
    lastActivity: {
        type: String,
        default: 'Account Created'
    },
    // You'd add a separate Activity model for logging actual actions
}, { timestamps: true });

// --- Mongoose Pre-Save Hook for Password Hashing (MANDATORY for security) ---
UserSchema.pre('save', async function (next) {
    // Only hash the password if it is new or has been modified
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare entered password with hashed password (for login)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;