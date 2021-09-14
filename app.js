const express = require('express');
const app = express();

const userRoutes = require('./routes/userPageRoute');
const adminRoutes = require('./routes/adminPageRoute');

const courseRoutes = require('./routes/api/courseRoute');

app.use(express.json());
app.use('/public', express.static('public'));

//page routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

//api routes
app.use('/api/v1/courses', courseRoutes);

module.exports = app;
