const express = require('express');
const app = express();

const userRoutes = require('./routes/userPageRoute');

app.use(express.json());
app.use('/public', express.static('public'));

//page routes

//api routes
app.use('/', userRoutes);


module.exports = app;