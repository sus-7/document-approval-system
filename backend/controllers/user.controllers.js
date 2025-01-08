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
        if (existingUser) {
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

const sendOTPVerificationEmail = async ({ username, email }, res) => {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Verify your email",
            html: `<p>Enter the OTP : <b>${otp}</b> on verification page to complete your registration</p><p>The OTP will expire in 1 hour</p>`,
        };

        //generate hashed otp
        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRounds);
        const newOTPVerification = await new UserOTPVerification({
            username,
            otp: hashedOtp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 3600000),
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

module.exports = {
    signIn,
    signUp,
    verifyOTP,
};
