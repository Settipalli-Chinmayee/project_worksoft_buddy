const departmentModel = require("../../models/departments.js");

const updateDept = async (req, res) => {
//   console.log(req.body);
// console.log(req.params)
  try {
    const { department, about } = req.body;
    const { id } = req.params;
    const update_dept = await departmentModel.findByIdAndUpdate(
      id,
      {
        department,
        about,
      },
      { new: true }
    );
    res.status(201).json({ message: "Department Updated" });
  } catch (error) {
    console.log("In department controllers", error.name, ":", error.message);
  }
};

module.exports = updateDept;
