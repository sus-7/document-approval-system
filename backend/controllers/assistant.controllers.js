const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { hashPassword, verifyPassword } = require("../utils/hashPassword");
const { transporter, MailOptions } = require("../utils/sendemail");
const asyncHandler = require("../utils/asyncHandler");
const path = require("path");

const createAssistant = asyncHandler(async (req, res, next) => {
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
    const assignedApprover = seniorAssistant.assignedApprover;
    const privateKey = crypto
        .randomBytes(32)
        .toString("base64")
        .replace(/[+/]/g, (m) => (m === "+" ? "-" : "_"));

    const hashedPassword = await hashPassword(password); // Using argon2 to hash the password

    const newUser = await new User({
        username,
        password: hashedPassword,
        fullName,
        email,
        mobileNo,
        privateKey,
        role: "Assistant",
        assignedApprover,
        isVerified: true,
    }).save();

    newUser.save().then(async () => {
        const mailOptions = new MailOptions(
            process.env.AUTH_EMAIL,
            email,
            "Your account credentials",
            `<b>You are now an assistant colleague for ${seniorAssistant.fullName}</b><p>Your account credentials for document approval system</p><p><b>Username:</b> ${username}</p><p><b>Password:</b> ${password}</p>`
        );
        await transporter.sendMail(mailOptions);
        //save new user in senior assistant's assistants list
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

const createApprover = asyncHandler(async (req, res, next) => {
    const seniorAssistant = await User.findOne({
        username: req.user.username,
        isVerified: true,
    });
    if (seniorAssistant.assignedApprover) {
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

    // Hash the password using argon2
    const hashedPassword = await hashPassword(password);

    const newUser = await new User({
        username,
        password: hashedPassword,
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
            { $set: { assignedApprover: newUser._id } },
            { $new: true }
        );
    }
    seniorAssistant.assignedApprover = newUser._id;
    await seniorAssistant.save();

    const mailOptions = new MailOptions(
        process.env.AUTH_EMAIL,
        email,
        "Your account credentials",
        `<b>You are now an approver for ${seniorAssistant.fullName}</b><p>Your account credentials for document approval system</p><p><b>Username:</b> ${username}</p><p><b>Password:</b> ${password}</p>`
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

const createUser = asyncHandler(async (req, res, next) => {
    const { role } = req.body;
    if (role === "Assistant") {
        await createAssistant(req, res, next);
    } else if (role === "Approver") {
        await createApprover(req, res, next);
    }
});

const getCreatedAssistants = asyncHandler(async (req, res, next) => {
    const seniorAssistant = await req.user.populate({
        path: "createdAssistants",
        select: "-password -privateKey",
    });
    if (seniorAssistant.createdAssistants.length === 0) {
        const error = new Error("No assistants created");
        error.statusCode = 400;
        return next(error);
    }
    return res.status(200).json({
        status: true,
        message: "Assistants fetched successfully",
        assistants: seniorAssistant.createdAssistants,
    });
});

const getApprover = asyncHandler(async (req, res, next) => {
    const seniorAssistant = await req.user.populate({
        path: "assignedApprover",
        select: "-password -privateKey",
    });
    if (!seniorAssistant.assignedApprover) {
        const error = new Error("No approver assigned");
        error.statusCode = 400;
        return next(error);
    }
    return res.status(200).json({
        status: true,
        message: "Approver fetched successfully",
        approver: seniorAssistant.assignedApprover,
    });
});
module.exports = {
    createUser,
    getCreatedAssistants,
    getApprover,
};
