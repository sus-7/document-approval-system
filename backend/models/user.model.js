const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
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
    },
    mobileNo: {
        type: Number,
        required: true,
    },
    assignedMinister: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assistants: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
    },
    role: {
        type: String,
        enum: ["Senior Assistant", "Assistant", "Approver", "Admin"],
        default: "Senior Assistant",
        required: true,
    },
    privateKey: {
        type: String,
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
