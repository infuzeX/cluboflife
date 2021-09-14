const router = require('express').Router();
const path = require('path');

router.get('/login', (req, res) => {
  const file = path.resolve('public/adminLogin.html');
  res.sendFile(file);
});

router.get('/dashboard', (req, res) => {
  const file = path.resolve('public/dashboard.html');
  res.sendFile(file);
});

router.get('/manage-student', (req, res) => {
  const file = path.resolve('public/manageStudent.html');
  res.sendFile(file);
});

module.exports = router;
