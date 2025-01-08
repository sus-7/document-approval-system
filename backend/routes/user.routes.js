const express = require("express");
const { signIn, signUp } = require("../controllers/user.controllers");
const router = express.Router();

router.post("/signup", authDetails, signUp);
module.exports = router;
