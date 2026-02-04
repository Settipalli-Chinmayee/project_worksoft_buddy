const mongoose = require("mongoose");

const subDeptSchema = new mongoose.Schema({
  subDepartment: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  skills: {
    type: [String],
    required: true,
  },
});

const deptSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
    },
    subDepartments: [subDeptSchema],
  },
  { timestamps: true, collection: "departments" }
);

const departmentModel = mongoose.model("company_departments", deptSchema);

module.exports = departmentModel;
