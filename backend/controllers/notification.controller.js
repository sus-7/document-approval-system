const Notification = require("../models/notification.model");
const asyncHandler = require("../utils/asyncHandler");

const getNotifications = asyncHandler(async (req, res, next) => {
    const notifications = await Notification.find({
        assignedTo: req.user._id,
        seen: false,
    });
    if (notifications.length === 0) {
        return res.status(200).json({
            status: true,
            message: "Notifications fetched successfully",
            notifications,
        });
    }
    await notifications.populate("assignedTo");
    return res.status(200).json({
        status: true,
        message: "Notifications fetched successfully",
        notifications,
    });
});

const markNotificationsAsSeen = asyncHandler(async (req, res, next) => {
    await Notification.updateMany(
        {
            assignedTo: req.user._id,
            seen: false,
        },
        { $set: { seen: true } }
    );
    return res.status(200).json({
        status: true,
        message: "Notifications marked as seen",
    });
});

module.exports = {
    getNotifications,
    markNotificationsAsSeen,
};
