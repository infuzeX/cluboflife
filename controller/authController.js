const User = require('../model/user');

const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const { promisify } = require('util');
const secret = process.env.TOKEN_SECRET;
const emailSecret = process.env.EMAIL_SECRET;
const expiresIn = eval(process.env.EXPIRES_IN);
const expiresInMin = parseInt(process.env.EXPIRES_IN_MIN);

//user login
exports.login = catchAsync(async (req, res, next) => {
  if (!req.body.email || !req.body.password)
    return next(new AppError('Please provide email or password!', 400));

  const user = await User.findOne({ email: req.body.email }).select(
    'name email role +password'
  );

  if (!user) return next(new AppError('Student not exist', 401));

  if (!(await user.comparePassword(req.body.password, user.password)))
    return next(new AppError('Incorrect Password', 401));
  const token = await promisify(jwt.sign)(
    { userId: user._id, role: user.role, name: user.name },
    secret,
    {
      expiresIn: expiresInMin,
    }
  );

  const dashboardRoute =
    user.role === 'admin' ? '/admin/dashboard' : '/dashboard';

  return res
    .status(200)
    .cookie('token', token, {
      expiresIn: expiresIn,
      httpOnly: true,
      secure: true,
    })
    .redirect(dashboardRoute);
  //   .json({ status: 'success', redirect: dashboardRoute })
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('No user found', 404));
  const token = await promisify(jwt.sign)(
    { userId: user._id, email: user.email },
    emailSecret,
    {
      expiresIn: process.env.EMAIL_EXPIRE,
    }
  );
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${token}`;
  const message = `Forgot your password? Reset using this link  ${resetURL}. `;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Valid only for 5 min',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (e) {
    console.log(e);

    return next(new AppError('Error sending email.Try again later', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  if (!token) return next(new AppError('Link expired', 401));

  const decoded = jwt.verify(token, emailSecret);
  if (!decoded) return next(new AppError('Link expired', 401));
  const user = await User.findOne({ _id: decoded.userId }).select('password');
  if (!user) return next(new AppError('Link expired', 401));
  user.password = password;
  await user.save();
  return res.status(200).json({ status: 'success' });
});

exports.editPassword = catchAsync(async (req, res, next) => {
  const userId = req.params?.userId;
  if (!userId || !req.body?.password)
    return next(new AppError('User not found', 404));

  const user = await User.findById(userId);
  if (!user) return next(new AppError('User not found', 404));
  user.password = req.body?.password;
  await user.save();
  return res.status(201).json({ status: 'success', user });
});

//validate authentication for apis
exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) throw { message: 'You are not logged In' };
  req.user = jwt.verify(token, secret);
  next();
});

exports.protectForgotPage = async (req, res, next) => {
  try {
    const token = req.params.token;
    if (!token) return res.send('Link Expired.Please Try again');
    const user = jwt.verify(token, emailSecret);
    if (!user) return res.send('Link Expired.Please Try again');
    return next();
  } catch (error) {
    return res.send('Link Expired.Please Try again');
  }
};

exports.restrictTo = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role))
      return next(
        new AppError('You are not allowed to perform this action!', 401)
      );
    return next();
  };
};

//validate authentication for pages
exports.protectPage = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) throw { message: 'You are not logged In' };
    req.user = jwt.verify(token, secret);
    return next();
  } catch (err) {
    const dashboardRoute = req.originalUrl.startsWith('/admin')
      ? '/admin/login'
      : '/';
    return res
      .cookie('token', '', { maxAge: 0, expiresIn: 0 })
      .redirect(dashboardRoute);
  }
};

exports.allowedTo = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) return res.redirect(req.user.role !== "student" ? "/admin/dashboard" : "/dashboard");
    return next();
  };
}

exports.protectLoginPage = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return next();
  const user = jwt.verify(token, secret);
  const dashboardRoute =
    user?.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  return res.redirect(dashboardRoute);
};


//prevent student access to another student data
exports.protectUserResource = catchAsync(async (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.userId === req.params.userId) return next();

  return next(new AppError('You are not allowed to perform this action!', 401));
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.userId }).select('password');

  if (!(await user.comparePassword(req.body.password, user.password)))
    return next(new AppError('Incorrect Password', 401));

  user.password = req.body.newPassword;
  await user.save();
  return res.status(200).json({
    status: 'success',
    message: 'Password Changed Successfully',
  });
});

exports.logout = (req, res) => {
  const token = req.cookies?.token;
  if (!token) res.redirect('/login');
  const user = jwt.decode(token, secret);
  const loginRoute = user.role === 'admin' ? '/admin/login' : '/';
  return res
    .cookie('token', '', { expiresIn: 0, maxAge: 0 })
    .redirect(loginRoute);
};
