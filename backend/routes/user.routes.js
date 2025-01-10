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
router.get("/status", verifyToken, checkAuthStatus);
//TODO: add otp validation middleware
router.post("/verifyOTP", verifyOTP);
router.post("/resendOTP", resendOTPAndVerify);

router.post("/sendPasswordResetOTP", sendPasswordResetOTP);
router.post("/verifySpOTP", verifySpOTP);
router.post("/resetPassword", verifySpToken, resetPassword);
module.exports = router;
