const router = require('express').Router();

const authController = require('../../controller/authController');
const userController = require('../../controller/studentController');

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(['admin']),
    userController.fetchUsers
  )
  .post(
    // authController.protect,
    // authController.restrictTo(['admin']),
    userController.userSignup
  );

router.get('/me', authController.protect, userController.getMe);

router
  .route('/:userId')
  .patch(
    authController.protect,
    authController.restrictTo(['admin', 'student']),
    authController.protectUserResource,
    userController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    authController.protectUserResource,
    userController.deleteUser
  );

router.get(
  '/export',
  authController.protect,
  authController.restrictTo(['admin']),
  userController.exportUsers
);

module.exports = router;
