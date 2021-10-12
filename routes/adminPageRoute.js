const router = require('express').Router();
const path = require('path');
const {
  allowedTo,
  protectLoginPage,
  protectPage,
} = require('../controller/authController');

router.get('/login', protectLoginPage, (req, res) => {
  const file = path.resolve('public/adminLogin.html');
  res.sendFile(file);
});

router.get('/dashboard', protectPage, allowedTo('admin'), (req, res) => {
  const file = path.resolve('public/dashboard.html');
  res.sendFile(file);
});

router.get('/manage-student', protectPage, allowedTo('admin'), (req, res) => {
  const file = path.resolve('public/manageStudent.html');
  res.sendFile(file);
});

router.get('/manage-course', protectPage, allowedTo('admin'), (req, res) => {
  const file = path.resolve('public/course-dashboard.html');
  res.sendFile(file);
});

router.get('/subscriptions', protectPage, allowedTo('admin'), (req, res) => {
  const file = path.resolve('public/subscriptions.html');
  res.sendFile(file);
});

router.get('/notifications', protectPage, allowedTo('admin'), (req, res) => {
  const file = path.resolve('public/notifications.html');
  res.sendFile(file);
});

module.exports = router;
