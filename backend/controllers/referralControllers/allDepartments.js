const departmentModel = require("../../models/departments.js");

const getDept = async(req,res) =>{
    try {
        const job_Details = await departmentModel.find();
        // console.log(job_Details)
        res.status(200).json(job_Details)
    } catch (error) {
        console.error("Error in allJobs = ", error.name , ":", error.message)
        res.status(500).json({ error: "Failed to fetch jobs" });
    }
}

module.exports = getDept;