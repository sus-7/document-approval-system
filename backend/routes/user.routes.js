const express = require("express");
const {
    signIn,
    signUp,
    verifyOTP,
    resendOTPAndVerify,
    checkAuthStatus,
    sendPasswordResetOTP,
    resetPassword,
    verifySpOTP,
    signOut,
} = require("../controllers/user.controllers");
const {
    signUpDetailsValidator,
    signiInDetailsValidator,
    verifyToken,
    verifySpToken,
} = require("../middlewares/user.middlewares");

const router = express.Router();

router.post("/signup", signUpDetailsValidator, signUp);
router.post("/signin", signiInDetailsValidator, signIn);
router.post("/signout", signOut);
router.get("/status", verifyToken, checkAuthStatus);
//TODO: add otp validation middleware
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTPAndVerify);

router.post("/send-password-reset-otp", sendPasswordResetOTP);
router.post("/verify-sp-otp", verifySpOTP);
router.post("/reset-password", verifySpToken, resetPassword);
module.exports = router;
