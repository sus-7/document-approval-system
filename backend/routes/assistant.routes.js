const express = require("express");
const router = express.Router();
const {
    createUserValidator,
    verifySeniorAssistant,
} = require("../middlewares/assistant.middlewares");
const { createAssistant } = require("../controllers/assistant.controllers");

router.post(
    "/create-user",
    verifySeniorAssistant,
    createUserValidator,
    createAssistant
);

module.exports = router;
