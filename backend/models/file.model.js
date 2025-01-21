const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
    fileUniqueName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    hidden: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ["Approved", "Rejected", "Correction", "Pending"],
        default: "Pending",
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
        required: true,
    },
    remark: {
        type: String,
    },
    description: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    approvedDate: {
        type: Date,
    },
    rejectedDate: {
        type: Date,
    },
    correctionDate: {
        type: Date,
    },
});

const File = mongoose.model("File", FileSchema);
module.exports = File;
