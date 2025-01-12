const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { transporter, MailOptions } = require("../utils/sendemail");

const createAssistant = async (req, res, next) => {
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
            const error = new Error(`duplicate user found with ${key}`);
            error.statusCode = 400;
            return next(error);
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
                return next(err);
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
                    `<p>Your account credentials for document approval system</p><p><b>Username:</b> ${username}</p><p><b>Password:</b> ${password}</p>`
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
        return next(error);
    }
};

const createApprover = async (req, res, next) => {
    try {
        const seniorAssistant = await User.findOne({
            username: req.user.username,
            isVerified: true,
        });
        if (seniorAssistant.assignedMinister) {
            const error = new Error("Max Approver limit reached!");
            error.statusCode = 400;
            return next(error);
        }
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
            const error = new Error(`duplicate user found with ${key}`);
            error.statusCode = 400;
            return next(error);
        }
        await User.deleteMany({
            $or: [{ username }, { email }, { mobileNo }],
            isVerified: false,
        });

        //assign minister to all assistants under senior assistant
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return next(err);
            }
            const newUser = await new User({
                username,
                password: hash,
                fullName,
                email,
                mobileNo,
                role: "Approver",
                isVerified: true,
            }).save();

            newUser.assistants.push(
                seniorAssistant._id,
                ...seniorAssistant.createdAssistants
            );
            await newUser.save();

            for (let assistant of seniorAssistant.createdAssistants) {
                await User.findByIdAndUpdate(
                    assistant,
                    { $set: { assignedMinister: newUser._id } },
                    { $new: true }
                );
            }
            seniorAssistant.assignedMinister = newUser._id;
            await seniorAssistant.save();

            const mailOptions = new MailOptions(
                process.env.AUTH_EMAIL,
                email,
                "Your account credentials",
                `<p>Your account credentials for document approval system</p><p><b>Username:</b> ${username}</p><p><b>Password:</b> ${password}</p>`
            );
            await transporter.sendMail(mailOptions);
            return res.status(200).json({
                status: true,
                message: "Approver created successfully",
                data: {
                    username,
                    email,
                    role: "Assistant",
                    fullName,
                },
            });
        });
    } catch (error) {
        console.log(
            "user-controller service :: createApprover :: error : ",
            error
        );
        return next(error);
    }
};

const createUser = async (req, res, next) => {
    const { role } = req.body;
    if (role === "Assistant") {
        await createAssistant(req, res, next);
    } else if (role === "Approver") {
        await createApprover(req, res, next);
    }
};

module.exports = {
    createUser,
};
