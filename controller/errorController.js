const AppError = require("../utils/appError");

//handle non operaional error
const handleCastErrorDB = (error) => {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new AppError(message, 400);
};
const handleDupErrorDB = (error) => {
    const prop = Object.keys(error.keyValue)[0];
    const message = `Duplicate value : ${error.keyValue[prop]} of field : ${prop}, please use another value`;
    return new AppError(message, 400);
};
const handleInvalidErrorDB = (error) => {
    const err = Object.values(error.errors).map(er => `${er.message} instead of ${er.value || null}`)
    const message = `Invalid inputs. ${err.join('. ')}`;
    return new AppError(message, 400);
}
const handleTokenError = () => new AppError("Invalid token, please login again", 401)
const handleTokenExpireError = () => new AppError("Your token has expired, please login again", 401)


const sendErrorProd = (res, err) => {
    //operational error, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        //Programming error or other unknown error
    } else {
        //log to check error
        console.error("ERROR : \n", err);
        //then send to client
        res.status(500).json({
            status: "error",
            message: "Something went very wrong",
        });
    }
};

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};


//error controller next(err) triggered this controller
module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    //send error in production mode
    console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV === "production") {
        let error = err;
        if (err.name === "CastError") error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDupErrorDB(error);
        if (err.name === "ValidationError") error = handleInvalidErrorDB(error);
        if (err.name === "JsonWebTokenError") error = handleTokenError(error);
        if (err.name === "TokenExpiredError") error = handleTokenExpireError(error);
        sendErrorProd(res, error);
    }
    //send error in development mode
    else {
        sendErrorDev(res, err);
    }
};
