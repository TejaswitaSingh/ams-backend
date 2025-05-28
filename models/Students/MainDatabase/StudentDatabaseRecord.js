import mongoose from "mongoose";

const StudentDatabaseSchema = new mongoose.Schema(
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
            match: /^[0-9]{10,15}$/ 
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            lowercase: true
        },
        profilePicture: {
            type: String,
            default: null
        },
        userType: {
            type: String,
            enum: ['student'],
            default: 'student',
            required: false
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: true,
            minlength: 3
        },
        status: {
            type: String,
            enum: ["pending", "active", "inactive"],
            default: "pending"
        },
        enrollmentDate: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const StudentDatabaseRecord = mongoose.model('Students', StudentDatabaseSchema);

export default StudentDatabaseRecord;