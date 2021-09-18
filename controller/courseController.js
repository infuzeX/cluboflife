const Course = require('../model/course');
const Student = require('../model/user');

const APIFeature = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create({
    name: req.body.name,
    courseCode: req.body.courseCode,
    description: req.body.description,
    courseLink: req.body.courseLink,
    instructor: req.body.instructor,
    createdAt: req.body.createdAt,
    publish: req.body.publish,
  });
  return res.status(200).json({ status: 'success', data: { course } });
});

exports.createTestCourse = catchAsync(async (req, res, next) => {
  console.log(req.body, req.files, req.file);
  if (!req.files) return next(new AppError('Course Image is required', 401));
  const course = await Course.create({
    name: req.body.name,
    courseCode: req.body.courseCode,
    description: req.body.description,
    courseLink: req.body.courseLink,
    instructor: req.body.instructor,
    createdAt: req.body.createdAt,
    publish: req.body.publish,
    image: {
      Key: req.files.key,
      url: req.files.location,
    },
  });
  return res.status(200).json({ status: 'success', data: { course } });
});

exports.fetchCourses = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(Course.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const courses = await feature.query;
  return res.status(200).json({
    status: 'success',
    results: courses.length,
    data: { courses },
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const result = await Course.updateOne({ _id: req.params.courseId }, req.body);
  if (!result.matchedCount) return next(new AppError('Course not found!', 404));
  if (!result.modifiedCount)
    return next(new AppError('Failed to update course', 400));
  return res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const result = await Course.deleteOne({ _id: req.params.courseId });
  if (!result.deletedCount) return next(new AppError('Course not found!', 404));
  return res.status(200).json({ status: 'success', data: null });
});
