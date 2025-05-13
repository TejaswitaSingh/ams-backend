const mongoose = require('mongoose');

const AdminDatabaseSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },
        phoneNumber: {
            type: String,
            unique: true,
            match: /^[0-9]{10,15}$/ // Basic phone number validation
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            lowercase: true
        },
        username: {
            type: String,
            unique: true,
            default: function() { return this.email; } // Defaults to email
        },
        profilePicture: {
            type: String,
            default: null
        },
        userType: {
            type: String,
            enum: ['admin', 'superadmin', 'moderator', 'support'],
            default: 'admin',
            required: true
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
        status: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Ensure username is set to email before saving if not provided
AdminDatabaseSchema.pre('save', function(next) {
    if (!this.username) {
        this.username = this.email;
    }
    next();
});

const AdminDatabaseRecord = mongoose.model('Admins', AdminDatabaseSchema);

module.exports = AdminDatabaseRecord;