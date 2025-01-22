const User = require("../models/user.model");
const Department = require("../models/department.model");
const { Role } = require("../utils/enums");
const asyncHandler = require("../utils/asyncHandler");
const Joi = require("joi");
const verifyFileAtrributes = asyncHandler(async (req, res, next) => {
    const fileAttributesSchema = Joi.object({
        assignedTo: Joi.string().required(), //username
        department: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().optional(),
    });
    const { error } = fileAttributesSchema.validate(req.body);
    console.log("body : ", req.body);
    if (error) {
        error.statusCode = 400;
        return next(error);
    }
    const assignedTo = await User.findOne({
        username: req.body.assignedTo,
        role: Role.APPROVER,
        isVerified: true,
        isActive: true,
    }).select("_id assistants");
    //user should be assistant of given assignedTo
    if (!assignedTo) {
        const error = new Error(`${req.body.assignedTo} not found!`);
        error.statusCode = 400;
        return next(error);
    }
    req.body.assignedTo = assignedTo._id;
    const assistant = req.user;
    if (!assignedTo.assistants.includes(assistant._id)) {
        const error = new Error("Access Denied!");
        error.statusCode = 400;
        return next(error);
    }

    const department = await Department.findOne({
        departmentName: req.body.department,
    });
    if (!department) {
        const error = new Error(`${req.body.department} not found!`);
        error.statusCode = 400;
        return next(error);
    }
    req.body.department = department._id;
    next();
});

module.exports = {
    verifyFileAtrributes,
};
