const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = Schema({
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    course: { type: mongoose.Types.ObjectId, ref: 'course' },
    boughtAt: {
        type: Date,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    active: Boolean
});

subscriptionSchema.methods.isSubscriptionExpired = async function () {
    return new Date(this.expiresAt).getTime() < Date.now()
};

module.exports = mongoose.model('subscription', subscriptionSchema);
