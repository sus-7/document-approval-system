const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

            res.send(200).json({
                success: true,
                message: "Login success!",
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
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) return res.status(500).json({ message: "Server Error" });
            const newUser = await User.create({
                username,
                password: hash,
                fullName,
                email,
                mobileNo,
            });
            return res
                .status(201)
                .json({ message: "User created successfully", data: newUser });
        });
    } catch (error) {
        console.log("user-controller service :: signup :: error : ", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

module.exports = {
    signIn,
    signUp,
};
