const User = require('../model/user');
const Subscription = require('../model/subscription');

const APIFeature = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { userColumn } = require('../utils/column');
const exportSheet = require('../utils/export');
const sendMail = require('../utils/email');


exports.userSignup = catchAsync(async (req, res, next) => {
  let mailSent = false;
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: 'student',
    password: req.body.password,
    createdAt: Date.now(),
  });

  try {
    await sendMail({
      email: req.body.email,
      subject: "Club Of Life Login Credentials!",
      message: `
      CREDENTIALS
        
      Name: ${req.body.name}
      Email: ${req.body.email}
      Password: ${req.body.password}

      Note: Please Do Not Share This Credentials With Anyone!
      `
    });
    mailSent = true;
  } catch (err) {
    mailSent = false;
    console.log(err.message)
  }

  return res.status(200).json({ status: 'success', data: { user, mailSent } });
});

exports.fetchUsers = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(User.find(), req.query)
    .filter()
    .limitFields()
    .sort()
  const students = await feature.query;
  return res.status(200).json({
    status: 'success',
    results: students.length,
    data: { students },
  });
});

exports.fetchUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.userId }).lean();
  return res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.userId }).lean();
  return res.status(200).json({
    status: 'success',
    data: { user },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const result = await User.updateOne({ _id: req.params.userId }, req.body);
  if (!result.matchedCount) return next(new AppError('User not found!', 404));
  if (!result.modifiedCount)
    return next(new AppError('Failed to update student!', 400));
  return res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  //delete users subscriptions first
  await Subscription.deleteMany({ user: req.params.userId });
  const result = await User.deleteOne({ _id: req.params.userId });
  if (!result.deletedCount) return next(new AppError('User not found!', 404));
  return res.status(200).json({ status: 'success', data: null });
});

//export student excel file
exports.exportUsers = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(User.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .lean();
  const students = await feature.query;
  if (!students.length)
    return res.status(404).json({ status: 'fail', data: null });
  const workbookXLSX = exportSheet(students, userColumn);
  res.setHeader(
    'Content-Type',
    'appication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachement; filename=Students');
  await workbookXLSX.write(res);
  res.end();
});
