const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        unique: true,
    },
    privateKey: {
        type: String,
    },
    assignedApprover: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assistants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    createdAssistants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    role: {
        type: String,
        enum: ["Senior Assistant", "Assistant", "Approver", "Admin"],
        default: "Senior Assistant",
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
