const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const UserOTPVerification = require("../models/userotp.model");
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
            return res.status(401).json({
                status: false,
                message: "No token found",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.username = decoded.username;
        next();
    } catch (error) {
        console.log("Auth middleware :: error : ", error);
        return res.status(500).json({
            status: false,
            message: "Server Error",
        });
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
        req.username = decoded.username;
        req.usage = decoded.usage;
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
module.exports = {
    signUpDetailsValidator,
    signiInDetailsValidator,
    verifyToken,
    verifySpToken,
};
