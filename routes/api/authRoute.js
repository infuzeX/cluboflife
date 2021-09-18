const router = require('express').Router();

const authController = require('../../controller/authController');

router.post('/login', authController.login);
router.patch(
  '/changepassword',
  authController.protect,
  authController.changePassword
);
router.get('/logout', authController.logout);
router.post('/forgotpassword', authController.forgotPassword);
router.patch('/resetpassword', authController.resetPassword);
router.patch(
  '/editpassword/:userId',
  authController.protect,
  authController.restrictTo(['admin']),
  authController.editPassword
);

module.exports = router;
