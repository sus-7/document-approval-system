const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { Role } = require("../utils/enums");
const { verifyFileAtrributes } = require("../middlewares/file.middlewares");
const { uploadPdf, downloadPdf } = require("../controllers/file.controllers");
const {
    verifyToken,
    authorizeRoles,
} = require("../middlewares/user.middlewares");

router.post(
    "/upload-pdf",
    upload.single("pdfFile"),
    verifyToken,
    authorizeRoles([Role.SENIOR_ASSISTANT, Role.ASSISTANT]),
    verifyFileAtrributes,
    uploadPdf
);

router.get(
    "/download-pdf/:filename",
    verifyToken,
    authorizeRoles([
        Role.ASSISTANT,
        Role.SENIOR_ASSISTANT,
        Role.APPROVER,
        Role.ADMIN,
    ]),
    downloadPdf
);
module.exports = router;
