const express = require("express");
const {
    signIn,
    signUp,
    verifyOTP,
} = require("../controllers/user.controllers");
const {
    signUpDetailsValidator,
    signiInDetailsValidator,
} = require("../middlewares/user.middlewares");

const router = express.Router();

router.post("/signup", signUpDetailsValidator, signUp);
router.post("/signin", signiInDetailsValidator, signIn);
router.post("/verifyOTP", verifyOTP);
module.exports = router;
