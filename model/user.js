const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: {
            values: ['student', 'admin'],
            message: 'Invalid Role!'
        }
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    //courses: { type: mongoose.Types.ObjectId, ref: 'course' },
    joinedAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('user', userSchema);