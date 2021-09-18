const router = require('express').Router();

const authController = require('../../controller/authController');
const courseController = require('../../controller/courseController');
const { imageUpload } = require('../../utils/multer');

router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo(['admin']),
    courseController.fetchCourses
  )
  .post(
    authController.protect,
    authController.restrictTo(['admin']),
    courseController.createCourse
  );

router
  .route('/:courseId')
  .patch(
    authController.protect,
    authController.restrictTo([
      'admin',
      // 'student'
    ]),
    courseController.updateCourse
  )
  .delete(
    authController.protect,
    authController.restrictTo(['admin']),
    courseController.deleteCourse
  );

router.post('/test', imageUpload, courseController.createTestCourse);

module.exports = router;
