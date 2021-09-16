const router = require('express').Router();

const authController = require('../../controller/authController');
const userController = require('../../controller/studentController');
const subscriptionController = require('../../controller/subscriptionController');

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

router.get(
  '/export',
  authController.protect,
  authController.restrictTo(['admin']),
  userController.exportUsers
);

router.get('/:userId/orders',
  authController.protect,
  authController.restrictTo(['admin', 'student']),
  subscriptionController.fetchUserOrders)

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


module.exports = router;
