const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { Role } = require("../utils/enums");
const {
  verifyToken,
  authorizeRoles,
} = require("../middlewares/user.middlewares");

const { getUsersByRole } = require("../controllers/admin.controllers");

router.get(
  "/get-users",
  verifyToken,
  authorizeRoles([Role.ADMIN]),
  getUsersByRole
);
module.exports = router;
