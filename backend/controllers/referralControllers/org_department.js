const departmentModel = require("../../models/departments.js");

const departmentPage = async (req, res) => {
  // console.log(req.body);
  try {
    const { department, about } = req.body;
    const createJob = await departmentModel.create({
      department,
      about,
    });
    res.status(201).json({ message: "Department Added" });
  } catch (error) {
    console.error("In department controllers", error.name, ":", error.message);
    if (error.code === 11000) {
      console.log("dept error")
      return res.status(409).json({ message: "Department already exists" });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = departmentPage;
