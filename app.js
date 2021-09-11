const express = require('express');
const app = express();

const userRoutes = require('./routes/userPageRoute');
const adminRoutes = require('./routes/adminPageRoute');
app.use(express.json());
app.use('/public', express.static('public'));

//page routes

//api routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

module.exports = app;
