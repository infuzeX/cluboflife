const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
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
    createdAt: {
        type: Date,
        required: true
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 2);
    next();
})

userSchema.methods.comparePassword = function (userPassword, hashedPassword) {
    return brcrypt.compare(userPassword, hashedPassword);
}

module.exports = mongoose.model('user', userSchema);