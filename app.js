const express = require('express');
const app = express();

const globalErrorController = require('./controller/errorController');

const userRoutes = require('./routes/userPageRoute');
const adminRoutes = require('./routes/adminPageRoute');

const authApiRoutes = require('./routes/api/authRoute');
const courseApiRoutes = require('./routes/api/courseRoute');
const userApiRoutes = require('./routes/api/userRoute'); 

app.use(express.json());
app.use('/public', express.static('public'));

//page routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

//api routes
app.use('/api/v1/auth', authApiRoutes);
app.use('/api/v1/courses', courseApiRoutes);
app.use('/api/v1/users', userApiRoutes);

app.use(globalErrorController)

module.exports = app;