const router = require('express').Router();
const path = require('path');
const {
  protectAdminPage,
  protectLoginPage,
  protectPage,
} = require('../controller/authController');

router.get('/login', protectLoginPage, (req, res) => {
  const file = path.resolve('public/adminLogin.html');
  res.sendFile(file);
});

router.get('/dashboard', protectPage, protectAdminPage, (req, res) => {
  const file = path.resolve('public/dashboard.html');
  res.sendFile(file);
});

router.get('/manage-student', protectPage, protectAdminPage, (req, res) => {
  const file = path.resolve('public/manageStudent.html');
  res.sendFile(file);
});

router.get('/manage-course', protectPage, protectAdminPage, (req, res) => {
  const file = path.resolve('public/course-dashboard.html');
  res.sendFile(file);
});

module.exports = router;
