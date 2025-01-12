const express = require("express");
const router = express.Router();
const {
    createUserValidator,
    verifySeniorAssistant,
    verifyApproverLimits,
} = require("../middlewares/assistant.middlewares");
const { createUser } = require("../controllers/assistant.controllers");

router.post(
    "/create-user",
    verifySeniorAssistant,
    createUserValidator,
    createUser
);

module.exports = router;
