const router = require('express').Router();

const authController = require('../../controller/authController');
const subscriptionController = require('../../controller/subscriptionController');

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(['admin']),
    subscriptionController.fetchSubscriptions
  )
  .post(
    authController.protect,
    authController.restrictTo(['admin']),
    subscriptionController.createSubscription
  );

router
  .route('/:subscriptionId')
  .patch(
    authController.protect,
    authController.restrictTo(['admin']),
    subscriptionController.updateSubscription
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    subscriptionController.deleteSubscription
  );

router.get(
  '/export',
  authController.protect,
  authController.restrictTo(['admin']),
  subscriptionController.exportCsv
);
module.exports = router;
