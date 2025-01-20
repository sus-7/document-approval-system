const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const UserOTPVerification = require("../models/userotp.model");
const { verifyPassword } = require("../utils/hashPassword");
const signUpDetailsSchema = Joi.object({
    // TODO: change after
    username: Joi.string().min(2),
    email: Joi.string().email(),
    password: Joi.string().min(2),
    fullName: Joi.string().min(2),
    mobileNo: Joi.number().min(10),
});
const signUpDetailsValidator = (req, res, next) => {
    const { error } = signUpDetailsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Invalid details",
            error: error.details[0].message,
        });
    }
    next();
};

const signInDetailsSchema = Joi.object({
    //TODO: change after
    username: Joi.string().min(2),
    password: Joi.string().min(2),
});

//todo: check if user is verified
const signiInDetailsValidator = (req, res, next) => {
    const { error } = signInDetailsSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Invalid details",
            error: error.details[0].message,
        });
    }
    next();
};

const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            const error = new Error("User not logged in");
            error.statusCode = 401;
            return next(error);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            const error = new Error("Invalid token");
            error.statusCode = 401;
            return next(error);
        }

        const user = await User.findOne({
            username: decoded.username,
            isActive: true,
        });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Auth middleware :: error : ", error);
        error.statusCode = 500;
        return next(error);
    }
};

const verifySpToken = async (req, res, next) => {
    try {
        const token = req.cookies.sptoken;
        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token found",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.usage !== "OTP") {
            return res.status(401).json({
                status: false,
                message: "No token found",
            });
        }
        const user = await User.findOne({ username: decoded.username });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        req.user = user;
        // req.username = decoded.username;
        // req.usage = decoded.usage;
        next();
    } catch (error) {
        console.log("Auth middleware :: error : ", error);
        return res.status(500).json({
            status: false,
            message: "Server Error",
        });
    }
};

const resetPasswordSchema = Joi.object({
    username: Joi.string().min(2),
    newPassword: Joi.string().min(2),
});

const resetPasswordValidator = (req, res, next) => {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Invalid details",
            error: error.details[0].message,
        });
    }
    next();
};

const verifyEmailExists = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            const error = new Error("Email is required");
            error.statusCode = 400;
            return next(error);
        }
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            return next(error);
        }
        next();
    } catch (error) {
        console.log("user-middleware :: verifyEmailExists :: error : ", error);
        error.statusCode = 500;
        return next(error);
    }
};

const verifyOldPassword = async (req, res, next) => {
    try {
        const { currentPassword } = req.body;
        if (!currentPassword) {
            const error = new Error("Current password is required");
            error.statusCode = 400;
            return next(error);
        }

        const isMatch = await verifyPassword(
            currentPassword,
            req.user.password
        );
        if (!isMatch) {
            const error = new Error("Invalid Current Password");
            error.statusCode = 400;
            return next(error);
        }
        next();
    } catch (error) {
        console.log("user-middleware :: verifyOldPassword :: error : ", error);
        error.statusCode = 500;
        return next(error);
    }
};

module.exports = {
    signUpDetailsValidator,
    signiInDetailsValidator,
    verifyToken,
    verifySpToken,
    verifyEmailExists,
    verifyOldPassword,
};
