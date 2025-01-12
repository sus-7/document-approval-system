const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { transporter, MailOptions } = require("../utils/sendemail");

const createAssistant = async (req, res) => {
    try {
        const { username, password, fullName, email, mobileNo } = req.body;
        const existingVerifiedUser = await User.findOne({
            $or: [{ username }, { email }, { mobileNo }],
            isVerified: true,
        });
        if (existingVerifiedUser) {
            const key =
                existingVerifiedUser.username === username
                    ? "username"
                    : existingVerifiedUser.email === email
                    ? "email"
                    : "mobileNo";
            throw new Error(`duplicate user found with ${key}`);
        }
        await User.deleteMany({
            $or: [{ username }, { email }, { mobileNo }],
            isVerified: false,
        });
        const seniorAssistant = await User.findOne({
            username: req.user.username,
            isVerified: true,
        });
        const assignedMinister = seniorAssistant.assignedMinister;
        const privateKey = crypto
            .randomBytes(32)
            .toString("base64")
            .replace(/[+/]/g, (m) => (m === "+" ? "-" : "_"));

        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                throw new Error("Server Error");
            }
            const newUser = await new User({
                username,
                password: hash,
                fullName,
                email,
                mobileNo,
                privateKey,
                role: "Assistant",
                assignedMinister: assignedMinister,
                isVerified: true,
            }).save();
            newUser.save().then(async () => {
                const mailOptions = new MailOptions(
                    process.env.AUTH_EMAIL,
                    email,
                    "Your account credentials",
                    `<p>Your account credentials for document approval system</p><p>Username: ${username}</p><p>Password: ${password}</p>`
                );
                await transporter.sendMail(mailOptions);
                //save new user in senior assistan's asstants list
                seniorAssistant.createdAssistants.push(newUser._id);
                await seniorAssistant.save();
                return res.status(200).json({
                    status: true,
                    message: "Assistant created successfully",
                    data: {
                        username,
                        email,
                        role: "Assistant",
                        fullName,
                    },
                });
            });
        });
    } catch (error) {
        console.log(
            "user-controller service :: createAssistant :: error : ",
            error
        );
        return res
            .status(500)
            .json({ status: "FAILED", message: error.message });
    }
};

module.exports = {
    createAssistant,
};
