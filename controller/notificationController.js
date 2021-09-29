const Notification = require('../model/notification');

const APIFeature = require('../utils/apifeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createNotification = catchAsync(async (req, res, next) => {
    const notification = await Notification.create({
        message: req.body.message,
        sender: req.user.name,
        createdAt: Date.now(),
    });
    return res.status(200).json({ status: 'success', data: { notification } });
});

exports.fetchNotifications = catchAsync(async (req, res, next) => {
    const feature = new APIFeature(Notification.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .paginate();
    const notifications = await feature.query;
    return res.status(200).json({
        status: 'success',
        results: notifications.length,
        data: { notifications },
    });
});

exports.deletenotification = catchAsync(async (req, res, next) => {
    const result = await Notification.deleteOne({ _id: req.params.notificationId });
    if (!result.deletedCount) return next(new AppError('Notification not found!', 404));
    return res.status(200).json({ status: 'success', data: null });
});
