const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
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

router.post(
    "/create-user",
    verifySeniorAssistant,
    createUserValidator,
    createUser
);

router.get(
    "/get-created-assistants",
    verifySeniorAssistant,
    getCreatedAssistants
);

router.get("/get-approver", verifyAssistant, getApprover);

router.post(
    "/upload-pdf",
    upload.single("pdfFile"),
    verifyAssistant,
    verifyFileAtrributes,
    uploadPdf
);
module.exports = router;
