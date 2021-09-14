const router = require('express').Router();

const authController = require('../../controller/authController');
const adminController = require('../../controller/adminController');

router.post('/',//authController.protect,
    //authController.restrictTo(['admin']),
    adminController.adminSignup);

router.post('/login', authController.adminlogin);

module.exports = router;