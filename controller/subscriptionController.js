const Subscription = require('../model/subscription');

const APIFeature = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { subscriptionColumn } = require('../utils/column');
const exportSheet = require('../utils/export');

exports.createSubscription = catchAsync(async (req, res, next) => {
  const subscription = await Subscription.create({
    user: req.body.userId,
    course: req.body.courseId,
    boughtAt: req.body.boughtAt,
    expiresAt: req.body.expiresAt,
    createdAt: Date.now(),
    active: true,
    paid: req.body.paid,
  });
  return res.status(200).json({ status: 'success', data: { subscription } });
});

exports.fetchSubscriptions = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(Subscription.find(), req.query)
    .filter()
    .limitFields()
    .sort()
    .paginate();
  const subscriptions = await feature.query;
  return res.status(200).json({
    status: 'success',
    results: subscriptions.length,
    data: { subscriptions },
  });
});

exports.fetchUserOrders = catchAsync(async (req, res, next) => {
  const feature = new APIFeature(
    Subscription.find({ user: req.user.userId }),
    req.query
  )
    .filter()
    .limitFields()
    .sort()
    .paginate();
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
  console.log(req.params);
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
