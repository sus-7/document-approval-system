const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema({
    departmentName: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Department", DepartmentSchema);
