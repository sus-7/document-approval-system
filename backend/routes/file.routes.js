const express = require("express");
const router = express.Router();
const upload = require("../utils/multerConfig");
const { Role } = require("../utils/enums");
const { verifyFileAtrributes } = require("../middlewares/file.middlewares");
const { uploadPdf } = require("../controllers/file.controllers");
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

module.exports = router;
