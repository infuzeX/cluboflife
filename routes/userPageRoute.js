const router = require('express').Router();
const path = require('path');
const {
  protectLoginPage,
  protect,
  protectPage,
  protectForgotPage,
} = require('../controller/authController');

router.get('/login', protectLoginPage, (req, res) => {
  const file = path.resolve('public/index.html');
  res.sendFile(file);
});

router.get('/signup', protectLoginPage, (req, res) => {
  const file = path.resolve('public/createAccount.html');
  res.sendFile(file);
});

router.get('/forgotPassword', protectLoginPage, (req, res) => {
  const file = path.resolve('public/forgotPassword.html');
  res.sendFile(file);
});

router.get('/profile', (req, res) => {
  const file = path.resolve('public/yourProfile.html');
  res.sendFile(file);
});

router.get('/dashboard', protectPage, (req, res) => {
  const file = path.resolve('public/yourProfile.html');
  res.sendFile(file);
});

router.get('/reset-password/:token', (req, res) => {
  const file = path.resolve('public/reset-password.html');
  res.sendFile(file);
});

module.exports = router;
