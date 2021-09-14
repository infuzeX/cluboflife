const Admin = require('../model/admin');

const catchAsync = require("../utils/catchAsync");

exports.adminSignup = catchAsync(async (req, res, next) => {
    const admin = await Admin.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });
    return res.status(200).json({ status: "success", data: { admin } })
});
