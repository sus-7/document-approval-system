const express = require("express");
const router = express.Router();
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

module.exports = router;
