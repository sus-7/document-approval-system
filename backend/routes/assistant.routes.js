const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { Role } = require("../utils/enums");
const {
    createUserValidator,
    verifySeniorAssistant,
    verifyAssistant,
} = require("../middlewares/assistant.middlewares");
const {
    createUser,
    getCreatedAssistants,
    getApprover,
} = require("../controllers/assistant.controllers");
const {
    verifyToken,
    authorizeRoles,
} = require("../middlewares/user.middlewares");

router.post(
    "/create-user",
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT]),
    createUserValidator,
    createUser
);

router.get(
    "/get-created-assistants",
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT]),
    getCreatedAssistants
);

router.get(
    "/get-approver",
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT, Role.ASSISTANT]),
    getApprover
);

module.exports = router;
