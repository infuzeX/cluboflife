const router = require('express').Router();
const path = require('path');

router.get('/login', (req, res) => {
  const file = path.resolve('public/index.html');
  res.sendFile(file);
});

router.get('/signup', (req, res) => {
  const file = path.resolve('public/createAccount.html');
  res.sendFile(file);
});

router.get('/forgotPassword', (req, res) => {
  const file = path.resolve('public/forgotPassword.html');
  res.sendFile(file);
});

router.get('/profile', (req, res) => {
  const file = path.resolve('public/yourProfile.html');
  res.sendFile(file);
});

router.get('/dashboard', (req, res) => {
  const file = path.resolve('public/course-dashboard.html');
  res.sendFile(file);
});

module.exports = router;
