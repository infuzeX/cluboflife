const router = require('express').Router();
const path = require('path');
const {
  protectLoginPage,
  protectPage,
  protectForgotPage,
} = require('../controller/authController');
const { hasUserSubscribed } = require('../controller/subscriptionController');

router.get('/', protectLoginPage, (req, res) => {
  const file = path.resolve('public/login.html');
  res.sendFile(file);
});

/*
router.get('/signup', protectLoginPage, (req, res) => {
  const file = path.resolve('public/createAccount.html');
  res.sendFile(file);
});*/

router.get('/forgotPassword', protectLoginPage, (req, res) => {
  const file = path.resolve('public/forgotPassword.html');
  res.sendFile(file);
});

router.get('/profile', protectPage, (req, res) => {
  const file = path.resolve('public/yourProfile.html');
  res.sendFile(file);
});

router.get('/account', protectPage, (req, res) => {
  const file = path.resolve('public/yourProfile.html');
  res.sendFile(file);
});

router.get('/dashboard', protectPage, (req, res) => {
  const file = path.resolve('public/allCourses.html');
  res.sendFile(file);
});

router.get('/reset-password/:token', (req, res) => {
  const file = path.resolve('public/reset-password.html');
  res.sendFile(file);
});

router.get(
  '/courses/:courseCode',
  protectPage,
  hasUserSubscribed,
  (req, res) => {
    const file = path.resolve(`public/courses/${req.params.courseCode}/index.html`);
    res.sendFile(file);
  }
);

module.exports = router;