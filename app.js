const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const globalErrorController = require('./controller/errorController');

const userRoutes = require('./routes/userPageRoute');
const adminRoutes = require('./routes/adminPageRoute');

const authApiRoutes = require('./routes/api/authRoute');
const courseApiRoutes = require('./routes/api/courseRoute');
const userApiRoutes = require('./routes/api/userRoute');
const subscriptionApiRoutes = require('./routes/api/subscriptionRoute');
const notificationApiRoutes = require('./routes/api/notifyRoute');

app.use(express.json());
app.use(cookieParser());
app.use('/public', express.static('public'));

//page routes
app.use('/', userRoutes);
app.use('/admin', adminRoutes);

//api routes
app.use('/api/v1/auth', authApiRoutes);
app.use('/api/v1/courses', courseApiRoutes);
app.use('/api/v1/users', userApiRoutes);
app.use('/api/v1/subscriptions', subscriptionApiRoutes);
app.use('/api/v1/notifications', notificationApiRoutes);

app.use(globalErrorController);

module.exports = app;