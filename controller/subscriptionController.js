const Subscription = require('../model/subscription');

const APIFeature = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { subscriptionColumn } = require('../utils/column');
const exportSheet = require('../utils/export');

exports.createSubscription = catchAsync(async (req, res, next) => {
  const hasSubscribed = await Subscription.findOne({
    user: req.body.userId,
    course: req.body.courseId,
    active: true,
  });
  if (hasSubscribed)
    return next(
      new AppError('User has already subscribed to this course', 401)
    );

  const subscription = await new Subscription({
    user: req.body.userId,
    course: req.body.courseId,
    boughtAt: req.body.boughtAt,
    forever: req.body.forever,
    expiresAt: req.body.expiresAt,
    createdAt: Date.now(),
    active: true,
    paid: req.body.paid,
  }).populate([{ path: 'course', select: 'name' }, { path: 'user', select: 'name email' }]);
  return res.status(200).json({ status: 'success', data: { subscription } });
});

exports.fetchSubscriptions = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(Subscription.find(), req.query)
    .filter()
    .limitFields()
    .sort()
  //.paginate();
  const subscriptions = await feature.query;
  return res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    data: { subscriptions },
  });
});

exports.fetchUserOrders = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(
    Subscription.find({ user: req.user.userId }).populate({
      path: 'course',
      select: 'name instructor courseCode'
    }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate()
  const subscriptions = await feature.query;
  return res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    data: { subscriptions },
  });
});

exports.updateSubscription = catchAsync(async (req, res, next) => {
  const result = await Subscription.updateOne(
    { _id: req.params.subscriptionId },
    req.body
  );
  if (!result.matchedCount) return next(new AppError('Course not found!', 404));
  if (!result.modifiedCount)
    return next(new AppError('Failed to update course', 400));
  return res.status(200).json({
    status: 'success',
    data: null,
  });
});

exports.deleteSubscription = catchAsync(async (req, res, next) => {
  const result = await Subscription.deleteOne({
    _id: req.params.subscriptionId,
  });
  if (!result.deletedCount)
    return next(new AppError('Subscription not found!', 404));
  return res.status(200).json({ status: 'success', data: null });
});

exports.exportCsv = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.find({}).lean();
  if (!subscription.length)
    return res.status(404).json({ status: 'fail', data: null });

  const workbookXLSX = exportSheet(subscription, subscriptionColumn);
  res.setHeader(
    'Content-Type',
    'appication/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachement; filename=Students');
  await workbookXLSX.write(res);
  res.end();
});

exports.hasUserSubscribed = catchAsync(async (req, res, next) => {
  const courseId = req.query?.courseId;
  if (!courseId) return res.redirect('/dashboard');
  const hasSubscribed = await Subscription.findOne({
    user: req.user.userId,
    course: courseId,
    active: true,
  });
  if (!hasSubscribed) return res.redirect('/dashboard');
  if (hasSubscribed.forever) return next();
  if (new Date(hasSubscribed.expiresAt).getTime() <= Date.now()) {
    hasSubscribed.active = false;
    await hasSubscribed.save({ validateBeforeSave: false });
    return res.redirect('/dashboard');
  }
  return next();
});
