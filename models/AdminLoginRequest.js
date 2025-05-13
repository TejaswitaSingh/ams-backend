const mongoose = require('mongoose');

const AdminLoginSchema = new mongoose.Schema(
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
            required: true,
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
        confirmPassword: {
            type: String,
            required: true,
            validate: {
                validator: function(v) {
                    return v === this.password;
                },
                message: "Passwords do not match!"
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        },
    },
    { timestamps: true }
);

const AdminLoginRequest = mongoose.model('AdminLogin', AdminLoginSchema);

module.exports = AdminLoginRequest;