const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserOTPVerification = require("../models/userotp.model");

const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});
const signIn = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        bcrypt.compare(password, user.password, async (err, isMatch) => {
            if (err)
                return res
                    .status(500)
                    .json({ message: "Internal server error" });
            if (!isMatch) {
                return res
                    .status(401)
                    .json({ message: "Invalid username or password" });
            }
            const token = jwt.sign(
                { username: username, email: user.email },
                process.env.JWT_SECRET
            );
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Login success!",
                token: token,
                user: {
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    fullName: user.fullName,
                },
            });
        });
    } catch (error) {
        console.log("user controller service :: signin :: error : ", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const signUp = async (req, res) => {
    try {
        const { username, password, fullName, email, mobileNo } = req.body;
        const existingUser = await User.findOne({
            $or: [{ username }, { email }, { mobileNo }],
        });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({
                message: "duplicate user found",
                key:
                    existingUser.username === username
                        ? "username"
                        : existingUser.email === email
                        ? "email"
                        : "mobileNo",
            });
        }
        if (existingUser && !existingUser.isVerified) {
            await User.deleteMany({ username });
        }
        const privateKey = crypto
            .randomBytes(32)
            .toString("base64")
            .replace(/[+/]/g, (m) => (m === "+" ? "-" : "_"));

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: "Server Error" });
            const newUser = await User.create({
                username,
                password: hash,
                fullName,
                email,
                mobileNo,
                privateKey,
            });
            newUser.save().then(() => {
                sendOTPVerificationEmail({ username, email }, res);
            });
        });
    } catch (error) {
        console.log("user-controller service :: signup :: error : ", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const checkAuthStatus = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.username });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            status: true,
            user: {
                username: user.username,
                email: user.email,
                role: user.role,
                fullName: user.fullName,
            },
        });
    } catch (error) {
        console.log("User controller :: checkAuthStatus :: error : ", error);
        return res.status(500).json({
            status: false,
            message: "Server Error",
        });
    }
};

const sendOTPVerificationEmail = async ({ username, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter the OTP : <b>${otp}</b> on verification page to complete your registration</p><p>The OTP will expire in 10 minutes</p>`,
        };

        //generate hashed otp
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new UserOTPVerification({
            username,
            otp: hashedOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 600000),
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        return res.status(200).json({
            status: "pending",
            message: "OTP sent successfully",
            data: {
                username,
                email,
            },
        });
    } catch (error) {
        console.log(
            "user-controller service :: sendUserVerificationEmail :: error : ",
            error
        );
        return res
            .status(500)
            .json({ status: "failed", message: "Server Error" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body;
        if (!username || !otp)
            return res.status(400).json({ message: "OTP is required" });
        else {
            const userOTPVerificationReacords = await UserOTPVerification.find({
                username,
            });
            if (userOTPVerificationReacords.length <= 0)
                return res.status(404).json({ message: "OTP not found" });
            else {
                const { expiresAt } = userOTPVerificationReacords[0];
                const hashedOtp =
                    userOTPVerificationReacords[
                        userOTPVerificationReacords.length - 1
                    ].otp;

                if (expiresAt < Date.now()) {
                    await UserOTPVerification.deleteMany({ username });
                    return res.status(400).json({ message: "OTP expired" });
                } else {
                    const isValid = await bcrypt.compare(otp, hashedOtp);
                    console.log(otp);
                    if (!isValid)
                        return res.status(400).json({ message: "OTP invalid" });
                    else {
                        await User.updateOne(
                            { username },
                            { isVerified: true }
                        );
                        await UserOTPVerification.deleteMany({ username });
                        return res.status(200).json({
                            status: "VERIFIED",
                            message: "OTP verified",
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.log("user-controller service :: verifyOTP :: error : ", error);
        return res
            .status(500)
            .json({ status: "FAILED", message: "Server Error" });
    }
};

const resendOTPAndVerify = async (req, res) => {
    try {
        const { username, email } = req.body;
        if (!username || !email) {
            return res.status(400).json({
                status: "FAILED",
                message: "Please provide username and email.",
            });
        } else {
            await UserOTPVerification.deleteMany({ username });
            sendOTPVerificationEmail({ username, email }, res);
        }
    } catch (error) {
        console.log(
            "user-controller service :: resendOTPAndVerify :: error : ",
            error
        );
        return res
            .status(500)
            .json({ status: "FAILED", message: "Server Error" });
    }
};

const sendPasswordResetOTP = async (user, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "OTP for reseting password",
            html: `<p>Enter the OTP : <b>${otp}</b> on verification page for changing your password</p><p>The OTP will expire in 10 minutes</p>`,
        };

        //generate hashed otp
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new UserOTPVerification({
            username,
            otp: hashedOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 600000),
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        const sptoken = jwt.sign(
            { username, email, usage: "OTP" },
            process.env.JWT_SECRET
        );
        res.cookie("sptoken", sptoken, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 10 * 60 * 1000,
        });
        return res.status(200).json({
            status: "pending",
            message: "OTP sent successfully",
            data: {
                username,
                email,
            },
        });
    } catch (error) {
        console.log(
            "user-controller service :: sendUserVerificationEmail :: error : ",
            error
        );
        return res
            .status(500)
            .json({ status: "failed", message: "Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        if (req.usage === "OTP") {
            const { newPassword } = req.body;
            const username = req.username;
            bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err)
                    return res.status(500).json({ message: "Server Error" });
                await User.updateOne({ username }, { password: hash });
                return res.status(200).json({
                    status: "SUCCESS",
                    message: "Password updated successfully",
                });
            });
        }
        const { username, newPassword } = req.body;
        bcrypt.hash(newPassword, 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: "Server Error" });
            await User.updateOne({ username }, { password: hash });
            return res.status(200).json({
                status: "SUCCESS",
                message: "Password updated successfully",
            });
        });
    } catch (error) {
        console.log(
            "user-controller service :: verifyOTPAndResetPassword :: error : ",
            error
        );
        return res
            .status(500)
            .json({ status: "failed", message: "Server Error" });
    }
};
module.exports = {
    signIn,
    signUp,
    verifyOTP,
    resendOTPAndVerify,
    checkAuthStatus,
};
