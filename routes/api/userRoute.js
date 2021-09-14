const router = require('express').Router();

const authController = require('../../controller/authController');
const userController = require('../../controller/userController');

router.route('/')
    .get(authController.protect,
        authController.restrictTo(['admin']),
        userController.userSignup)
    .post(authController.protect,
        authController.restrictTo(['admin']),
        userController.fetchUsers)

router.post('/login', authController.login)

router.route('/:userId')
    .patch(authController.protect,
        authController.restrictTo(['admin', 'student']),
        authController.protectUserResource,
        userController.updateUser)
    .delete(authController.protect,
        authController.restrictTo(['admin']),
        authController.protectUserResource,
        userController.deleteUser)

module.exports = router;