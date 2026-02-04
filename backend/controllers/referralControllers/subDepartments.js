const departmentModel = require("../../models/departments.js");

async function addSubDepartments(req, res) {
  try {
    const { subDepartment, skills } = req.body;
    const { id, val } = req.params;

    const department = await departmentModel.findById(id);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    if (val) {
      const subDeptIndex = department.subDepartments.findIndex(
        (subDept) => subDept._id.toString() === val.toString()
      );

      if (subDeptIndex === -1) {
        return res.status(404).json({ message: "Sub-department not found" });
      }

      department.subDepartments[subDeptIndex].skills = skills;
      department.subDepartments[subDeptIndex].subDepartment = subDepartment;
    } else {
      const duplicate = department.subDepartments.find(
        (subDept) => subDept.subDepartment.toLowerCase() === subDepartment.toLowerCase()
      );

      if (duplicate) {
        console.log("dept")
        return res.status(409).json({ message: "Sub-department already exists" });
      }
      department.subDepartments.push({
        subDepartmentId: generateSubDeptId(),
        subDepartment,
        skills,
      });
    }

    const updatedDept = await department.save();

    res.status(200).json({
      message: val
        ? "Sub-department updated successfully"
        : "Sub-department added successfully",
      department: updatedDept,
    });
  } catch (error) {
    console.error("Error in addSubDepartments:", error.name, error.message);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

function generateSubDeptId() {
  return Math.random().toString(36).substring(2, 9);
}

module.exports = {
  addSubDepartments,
};
