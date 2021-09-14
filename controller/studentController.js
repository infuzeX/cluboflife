const User = require('../model/user');

const APIFeature = require('../utils/apifeatures');
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const exportSheet = require("../utils/export");

exports.userSignup = catchAsync(async (req, res, next) => {
    const joinedAt = Date.now();
    if (req.body.expiresAt < joinedAt)
        return next(new AppError("Subscription should be greater than current date", 400));
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: 'student',
        password: req.body.password,
        courses: req.body.courses,
        expiresAt: req.body.expiresAt,
        joinedAt
    });
    return res.status(200).json({ status: "success", data: { user } })
})

exports.fetchUsers = catchAsync(async (req, res, next) => {
    const feature = new APIFeature(User.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .paginate()
    const students = await feature.query;
    return res.status(200).json({
        status: "success",
        results: students.length,
        data: { students }
    });
});

exports.fetchUser = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.userId }).lean();
    return res.status(200).json({
        status: "success",
        data: { user }
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    //restrict fields
    if (req.user.role !== 'admin') {
        ['password', 'expiresAt', 'courses'].forEach(field => {
            if (req.body[field]) delete req.body[field];
        })
    }
    await User.updateOne({ _id: req.params.userId }, req.body);
    return res.status(200).json({
        status: "success",
        data: null
    });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const result = await User.deleteOne({ _id: req.params.userId });
    if (!result.n) return next(new AppError('User not found!', 404));
    return res.status(200).json({ status: "success", data: null });
});

//export student excel file
exports.exportUsers = catchAsync(async (req, res, next) => {
    const feature = new APIFeature(User.find(), req.query)
        .filter()
        .limitFields()
        .sort()
        .paginate()
    const students = await feature.query;
    if (!students.length) return res.status(404).json({ status: "fail", data: null })
    const workbookXLSX = exportSheet(students);
    res.setHeader("Content-Type", "appication/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachement; filename=Students");
    await workbookXLSX.write(res)
    res.end();
});