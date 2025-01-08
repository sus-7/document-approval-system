const Joi = require("joi");

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

module.exports = { signUpDetailsValidator, signiInDetailsValidator };
