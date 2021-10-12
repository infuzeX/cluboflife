const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'user' },
  course: { type: mongoose.Types.ObjectId, ref: 'course' },
  boughtAt: {
    type: Date,
    required: true,
  },
  forever: Boolean,
  expiresAt: {
    type: Date,
    required: true,
    validate: {
      validator: function (el) {
        if (this.forever) return true;
        return new Date(this.expiresAt).getTime() > Date.now();
      },
      message: 'Expiry Date Should be greater than Current Date'
    }
  },

  createdAt: {
    type: Date,
    required: true,
    validate: {
      validator: function (el) {
        return new Date(this.expiresAt).getTime() > new Date(el).getTime()
      },
      message: 'Expiry Date Should be greater than creation Date'
    }
  },
  active: Boolean,
  paid: {
    type: String,
    required: true,
  },
});

subscriptionSchema.pre(/find/, function (next) {
  this.find().populate([
    { path: 'user', select: 'name email' },
    { path: 'course', select: 'name instructor courseCode description' },
  ]);
  next();
});

subscriptionSchema.methods.isSubscriptionExpired = async function () {
  return new Date(this.expiresAt).getTime() < Date.now();
};

module.exports = mongoose.model('subscription', subscriptionSchema);
