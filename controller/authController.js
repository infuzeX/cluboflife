const User = require('../model/user');

const bcrypt = require('bcryptjs');

const jwt = require("jsonwebtoken");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const secret = process.env.TOKEN_SECRET;
const expiresIn = eval(process.env.MAX_AGE);
const expiresInMin = process.env.MAX_AGE_IN_MIN;

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const currentTime = Date.now();

    if (!email || !password)
        return next(new AppError("Please provide email or password!", 400));

    const user = await User.findOne({ email }).lean();

    if (!user)
        return next(new AppError("Student not exist", 401));

    if (bcrypt.compare(password, user.password))
        return next(new AppError("Incorrect Password", 401));
    //check subscription
    if (user.role !== 'admin') {
        if (user.expiresAt <= currentTime)
            return next(new AppError("Your subscription has expired", 401));
    }

    const token = jwt.sign({ userId: user._id, role: user.role, expiresAt: user.expiresAt }, secret, {
        expiresIn: expiresInMin
    });

    return res.status(200)
        .cookie("token", token, { expiresIn, httpOnly: true, secure: true })
        .json({ status: "success", data: { path: "/dashboard" } });
});

exports.protect = catchAsync(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) throw { message: "You are not logged In" };
    req.user = jwt.verify(token, secret);
    next();
})

exports.protectApi = (req, res, next) => {
    if (!req.user.userId)
        return next(new AppError("You are not logged In", 401));
    next();
}

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.include(req.user.role))
            return next(new AppError("You are not allowed to perform this action!", 401));
        return next();
    }
}

exports.protectUserResource = catchAsync(async (req, res, next) => {
    if (req.user.role === admin) return next();
    if (req.user.userId === req.params.userId) return next();

    return next(new AppError("You are not allowed to perform this action!", 401));
});

exports.protectPage = (req, res, next) => {
    if (!req.user.userId) return res.redirect(req.data.path)
    if (req.user.role !== "admin") return res.redirect('/dashboard');
    next();
}

exports.protectLoginPage = (req, res, next) => {
    if (req.data.user)
        return res.redirect('/dashboard');
    next();
}

exports.changePassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.params.userId })
    if (req.body.currentPassword !== user.password)
        return next(new AppError("Incorrect Password", 401));
    user.password = req.body.newPassword;
    await user.save();
    return res.status(200).json({
        status: "success",
        message: "Password Changed Successfully"
    });
});