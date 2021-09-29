const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = Schema({
  message:{
      type:String,
      required:[true,'Notification message is required']
  },
  sender:String,
  createdAt:Date
});

module.exports = mongoose.model('notification', notificationSchema);