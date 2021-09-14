const router = require('express').Router();

const authController = require('../../controller/authController');
const courseController = require('../../controller/courseController');

router.route('/')
    .get(//authController.protect,
        //authController.restrictTo(['admin']),
        courseController.fetchCourses)
    .post(//authController.protect,
        //authController.restrictTo(['admin']),
        courseController.createCourse)
/*
router.route('/:userId')
    .patch(authController.protect,
        authController.restrictTo(['admin', 'student']),
        authController.protectUserResource,
        userController.updateUser)
    .delete(authController.protect,
        authController.restrictTo(['admin']),
        authController.protectUserResource,
        userController.deleteUser)
*/
module.exports = router;