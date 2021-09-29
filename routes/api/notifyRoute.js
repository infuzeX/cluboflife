const router = require('express').Router();

const authController = require('../../controller/authController');
const notificationController = require('../../controller/notificationController');

router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo(['admin', 'student']),
        notificationController.fetchNotifications
    )
    .post(
        authController.protect,
        authController.restrictTo(['admin']),
        notificationController.createNotification
    );

router
    .route('/:notificationId')
    .delete(
        authController.protect,
        authController.restrictTo(['admin',]),
        notificationController.deletenotification
    );


module.exports = router;
