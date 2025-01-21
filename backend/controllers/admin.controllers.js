const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const { Role } = require("../utils/enums");

const getUsersByRole = asyncHandler(async (req, res, next) => {
    const { role } = req.query;
    if (!role) {
        const error = new Error("Role is required");
        error.statusCode = 400;
        return next(error);
    }
    const users = await User.find({
        role: { $ne: Role.ADMIN },
        isVerified: true,
        isActive: true,
    })
        .select(
            "username fullName email role isActive mobileNo assignedApprover"
        )
        .populate("assignedApprover", "username fullName email");

    return res.status(200).json({
        status: true,
        message: "Users fetched successfully",
        users,
    });
});

module.exports = {
    getUsersByRole,
};
