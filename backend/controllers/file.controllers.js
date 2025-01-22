const path = require("path");
const File = require("../models/file.model");
const asyncHandler = require("../utils/asyncHandler");
const appConfig = require("../config/appConfig");
const { Role } = require("../utils/enums");
const uploadPdf = asyncHandler(async (req, res, next) => {
    //only take description if available
    const { department, title, description = null } = req.body;
    const file = req.file;
    const fileUniqueName = file.filename;
    const filePath = file.path;
    const newFile = await new File({
        fileUniqueName,
        filePath,
        createdBy: req.user._id,
        assignedTo: req.user.assignedApprover,
        department,
        title,
        description,
    }).save();

    const populatedFile = await newFile.populate([
        { path: "createdBy", select: "fullName" },
        { path: "assignedTo", select: "fullName" },
    ]);

    return res.status(200).json({
        status: true,
        message: "File uploaded successfully",
        file: {
            fileName: populatedFile.fileUniqueName,
            createdBy: populatedFile.createdBy.fullName,
            assignedTo: populatedFile.assignedTo.fullName,
            title: populatedFile.title,
            description: populatedFile.description,
        },
    });
});

const downloadPdf = asyncHandler(async (req, res, next) => {
    const fileName = req.params.filename;
    const file = await File.findOne({ fileUniqueName: fileName });
    if (!file) {
        const error = new Error("File not found");
        error.status = 404;
        return next(error);
    }
    if (req.user.role === Role.ASSISTANT && file.createdBy !== req.user.id) {
        const error = new Error("You are not authorized to download this file");
        error.status = 403;
        return next(error);
    }
    res.setHeader(
        "Content-disposition",
        `attachment; filename=${file.fileUniqueName}`
    );
    const filePath = path.join(appConfig.baseUploadDir, file.fileUniqueName);
    res.setHeader("Content-type", "application/pdf");
    res.sendFile(filePath);
});

module.exports = {
    uploadPdf,
    downloadPdf,
};
