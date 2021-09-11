const router = require('express').Router();
const path = require('path');

router.get('/login', (req, res) => {
  const file = path.resolve('public/adminLogin.html');
  res.sendFile(file);
});

module.exports = router;
