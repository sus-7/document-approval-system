const mongoose = require("mongoose");

const UserOTPSchema = new mongoose.Schema({
    username: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
});

const UserOTPVerification = mongoose.model(
    "UserOTPVerification",
    UserOTPSchema
);

module.exports = UserOTPVerification;
