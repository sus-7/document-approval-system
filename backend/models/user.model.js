const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobileNo: { type: Number, required: true },
  assignedMinister: { type: Number, ref: "User" },
  pas: [{ type: Number, ref: "User" }], // Array of IDs referencing other Users
  role: { type: String, enum: ["PA", "mantri"], required: true },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("User", UserSchema);
