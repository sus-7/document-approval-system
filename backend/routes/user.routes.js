const express = require("express");
const {
    signIn,
    signUp,
    verifyOTP,
    resendOTPAndVerify,
    checkAuthStatus,
} = require("../controllers/user.controllers");
const {
    signUpDetailsValidator,
    signiInDetailsValidator,
    verifyToken,
} = require("../middlewares/user.middlewares");

const router = express.Router();

router.post("/signup", signUpDetailsValidator, signUp);
router.post("/signin", signiInDetailsValidator, signIn);
router.get("/status", verifyToken, checkAuthStatus);
//TODO: add otp validation middleware
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTPAndVerify);

// router.get("/passwordResetOTP", passwordResetOTP);
// router.post("/forgotAndResetPassword", verifySpToken, resetPassword);
module.exports = router;
