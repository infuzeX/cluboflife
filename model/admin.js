const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const brcrypt = require('bcryptjs');

const adminSchema = Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'admin'
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
    }
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await brcrypt.hash(this.password, 2);
    next();
})

adminSchema.methods.comparePassword = function(userPassword, hashedPassword) {
    return brcrypt.compare(userPassword, hashedPassword);
}

module.exports = mongoose.model('admin', adminSchema);