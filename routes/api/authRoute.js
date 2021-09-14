const router = require('express').Router();

const authController = require('../../controller/authController');

router.patch('/changepassword', authController.changePassword);
router.get('/logout', authController.logout);

module.exports = router;