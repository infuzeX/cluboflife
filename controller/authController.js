const Admin = require('../model/admin');
const User = require('../model/user');

const jwt = require("jsonwebtoken");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const user = require('../model/user');

const secret = process.env.TOKEN_SECRET;
const expiresIn = eval(process.env.MAX_AGE);
const expiresInMin = process.env.MAX_AGE_IN_MIN;

exports.adminlogin = catchAsync(async (req, res, next) => {
    if (!req.body.email || !req.body.password)
        return next(new AppError("Please provide email or password!", 400));

    const user = await Admin.findOne({ email: req.body.email }).select("name email role +password");

    if (!user)
        return next(new AppError("Admin not exist", 401));

    if (!user.comparePassword(req.body.password, user.password))
        return next(new AppError("Incorrect Password", 401));

    const token = jwt.sign({ userId: user._id, role: user.role },
        secret, {
        expiresIn: expiresInMin
    });

    return res.status(200)
        .cookie("token", token, { expiresIn, httpOnly: true, secure: true })
        .redirect('/admin/dashboard');
});

//user login
exports.login = catchAsync(async (req, res, next) => {

    const currentTime = Date.now();

    if (!req.body.email || !req.body.password)
        return next(new AppError("Please provide email or password!", 400));

    const user = await User.findOne({ email: req.body.email }).select('');

    if (!user)
        return next(new AppError("Student not exist", 401));

    if (user.comparePassword(req.body.password, user.password))
        return next(new AppError("Incorrect Password", 401));
    //check subscription
    if (user.expiresAt <= currentTime)
        return next(new AppError("Your subscription has expired", 401));

    const token = jwt.sign({ userId: user._id, role: user.role, expiresAt: user.expiresAt }, secret, {
        expiresIn: expiresInMin
    });

    return res.status(200)
        .cookie("token", token, { expiresIn, httpOnly: true, secure: true })
        .redirect("/dashboard");
});

//validate authentication for apis
exports.protect = catchAsync(async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) throw { message: "You are not logged In" };
    req.user = jwt.verify(token, secret);
    next();
})

exports.restrictTo = (roles) => {
    return (req, res, next) => {
        if (!roles.include(req.user.role))
            return next(new AppError("You are not allowed to perform this action!", 401));
        return next();
    }
}

//validate authentication for pages
exports.protectPage = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) throw { message: "You are not logged In" };
        req.user = jwt.verify(token, secret);
        return next();
    } catch (err) {
        const dashboardRoute = req.originalUrl.startsWith("/admin") ? "/admin/login" : "/login";
        return res.cookie('token', '', { maxAge: 0, expiresIn: 0 }).redirect(dashboardRoute);
    }
}

exports.protectAdminPage = (req, res, next) => {
    if (req.user.role !== "admin") return res.redirect("/dashbaord");
    return next();
}

exports.protectLoginPage = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return next();
    const dashboardRoute = req.user.role === "admin" ? "/admin/dashboard" : "/dashboard";
    return res.redirect(dashboardRoute);
}

//prevent student access to another student data
exports.protectUserResource = catchAsync(async (req, res, next) => {
    if (req.user.role === admin) return next();
    if (req.user.userId === req.params.userId) return next();

    return next(new AppError("You are not allowed to perform this action!", 401));
});

exports.changePassword = catchAsync(async (req, res, next) => {
    const UserModel = req.query.user === "admin" ? Admin : User;

    const user = await UserModel.findOne({ _id: req.user.userId })
    if (!user.comparePassword(req.body.password, user.password))
        return next(new AppError("Incorrect Password", 401));

    user.password = req.body.newPassword;
    await user.save();
    return res.status(200).json({
        status: "success",
        message: "Password Changed Successfully"
    });
});

exports.logout = (req, res) => {
    const token = req.cookies.token;
    if (!token) res.redirect("/login");
    const user = jwt.decode(token, secret);
    const loginRoute = user.role === "admin" ? "/admin/login" : "/login";
    return res.cookie('token', '', { expiresIn: 0, maxAge: 0 }).redirect(loginRoute)
}