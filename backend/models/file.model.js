const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  _id: Number,
  fileUniqueName: { type: String, required: true },
  filePath: { type: String, required: true },
  createdBy: { type: Number, ref: "User", required: true },
  assignedTo: { type: Number, ref: "User" }, // New field referencing User model
  hidden: { type: Boolean, default: false },
  status: { type: String, enum: ["A", "R", "C", "P"], required: true }, // A = Approved, R = Rejected, C = Correction, P = Pending
  department: { type: Number, ref: "Department", required: true },
  remark: { type: String },
  description: { type: String },
  title: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
  approvedDate: { type: Date },
  rejectedDate: { type: Date },
  correctionDate: { type: Date },
});

module.exports = mongoose.model("File", FileSchema);
