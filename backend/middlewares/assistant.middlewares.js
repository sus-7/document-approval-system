const User = require("../models/user.model");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const createUserValidationsSchema = Joi.object({
    username: Joi.string().min(2).required(),
    fullName: Joi.string().min(2).required(),
    mobileNo: Joi.number().min(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(2).required(),
    role: Joi.string().valid("Assistant", "Approver").required(),
});

const createUserValidator = (req, res, next) => {
    const { error } = createUserValidationsSchema.validate(req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }
    next();
};

const verifySeniorAssistant = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        const error = new Error("Access Denied!");
        error.statusCode = 401;
        return next(error);
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ username: decoded.username });
        if (!user) {
            const error = new Error("Access Denied!");
            error.statusCode = 400;
            return next(error);
        }
        if (user.role !== "Senior Assistant") {
            throw new Error("Access Denied!");
        }
        req.user = user;
        next();
    } catch (error) {
        error.statusCode = 401;
        return next(error);
    }
};

module.exports = {
    createUserValidator,
    verifySeniorAssistant,
};
