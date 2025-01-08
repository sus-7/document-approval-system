const Joi = require("joi");

const authDetailsValidator = Joi.object({
    username: Joi.string().min(5),
    email: Joi.string().email(),
    password: Joi.string().min(8),
    fullName: Joi.string().min(5),
    mobileNo: Joi.number().min(10),
});
const authDetails = (req, res, next) => {
    const { error } = authDetailsValidator.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Invalid details" });
    }
    next();
};
