import mongoose from "mongoose";

const TeacherDatabaseSchema = new mongoose.Schema(
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
            match: /^[0-9]{10,15}$/ // Basic phone number validation
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
            enum: ['teacher'],
            default: 'teacher',
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
            type: Boolean,
            enum:["pending,true,false"],
            default: "pending"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const TeacherDatabaseRecord = mongoose.model('Teachers', TeacherDatabaseSchema);

export default TeacherDatabaseRecord;
