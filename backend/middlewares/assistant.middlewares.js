const User = require("../models/user.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const createUserValidationsSchema = Joi.object({
    username: Joi.string().min(2),
    fullName: Joi.string().min(2),
    mobileNo: Joi.number().min(10),
    email: Joi.string().email(),
    password: Joi.string().min(2),
    role: Joi.string().valid("Assistant", "Approver"),
});

const createUserValidator = (req, res, next) => {
    const { error } = createUserValidationsSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }
    next();
};

const verifySeniorAssistant = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        // throw new Error("Access Denied!");
        const error = new Error("Access Denied!");
        error.statusCode = 401;
        return next(error);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "Senior Assistant") {
            throw new Error("Access Denied!");
        }
        req.user = decoded;
        next();
    } catch (error) {
        // return res.status(401).json({
        //     status: false,
        //     message: error.message,
        // });
        error.statusCode = 401;
        return next(error);
    }
};
module.exports = {
    createUserValidator,
    verifySeniorAssistant,
};
