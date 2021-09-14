const express = require('express');
const app = express();

const userRoutes = require('./routes/userPageRoute');
const adminRoutes = require('./routes/adminPageRoute');

const courseApiRoutes = require('./routes/api/courseRoute');
const errorHandler = require('./controller/errorController');

app.use(express.json());
app.use('/public', express.static('public'));

//page routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

//api routes
app.use('/api/v1/courses', courseApiRoutes);
app.use(errorHandler);

module.exports = app;
