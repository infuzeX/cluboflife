const Subscription = require('../model/subscription');

const APIFeature = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createSubscription = catchAsync(async (req, res, next) => {
    const subscription = await Subscription.create({
        user: req.body.userId,
        course: req.body.courseId,
        boughtAt: req.body.boughtAt,
        expiresAt: req.body.expiresAt,
        createdAt: Date.now(),
        active: true,
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
    const feature = new APIFeature(Subscription.find({ user: req.user.userId }), req.query)
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
})

exports.updateSubscription = catchAsync(async (req, res, next) => {
    const result = await Subscription.updateOne({ _id: req.params.subscriptionId }, req.body);
    if (!result.matchedCount) return next(new AppError('Course not found!', 404));
    if (!result.modifiedCount)
        return next(new AppError('Failed to update course', 400));
    return res.status(200).json({
        status: 'success',
        data: null,
    });
});