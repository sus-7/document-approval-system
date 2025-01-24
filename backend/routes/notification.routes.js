const Notification = require("../models/notification.model");
const express = require("express");
const router = express.Router();
const {
    verifyToken,
    authorizeRoles,
} = require("../middlewares/user.middlewares");
const {
    getNotifications,
    markNotificationsAsSeen,
} = require("../controllers/notification.controller");
const { Role } = require("../utils/enums");

router.get(
    "/get-notifications",
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT, Role.ASSISTANT, Role.APPROVER]),
    getNotifications
);

router.post(
    "/mark-seen",
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT, Role.ASSISTANT, Role.APPROVER]),
    markNotificationsAsSeen
);

module.exports = router;
