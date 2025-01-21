const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { Role } = require("../utils/enums");
const {
    createUserValidator,
    verifySeniorAssistant,
    verifyAssistant,
    verifyFileAtrributes,
} = require("../middlewares/assistant.middlewares");
const {
    createUser,
    getCreatedAssistants,
    getApprover,
    uploadPdf,
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

router.post(
    "/upload-pdf",
    upload.single("pdfFile"),
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT, Role.ASSISTANT]),
    verifyFileAtrributes,
    uploadPdf
);
module.exports = router;
