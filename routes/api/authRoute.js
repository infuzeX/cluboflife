const router = require('express').Router();

const authController = require('../../controller/authController');

router.post('/login', authController.login);
router.patch(
  '/changepassword',
  authController.protect,
  authController.changePassword
);
router.get('/logout', authController.logout);

module.exports = router;
