const JobDetails = require("../../models/jobDetails"); // Ensure this points to your Mongoose model

const updateHire = async (req, res) => {
    // console.log(req.body);

    const {  jobTitle, jobDescription, jobSkills, jobQualification, jobType, endDate } = req.body;
    const {id} = req.params;
    
    if (!id) {
        return res.status(400).json({ message: "Job ID is required" });
    }

    try {
        
        const updatedJob = await JobDetails.findByIdAndUpdate(
            id, 
            {
                jobTitle,
                jobDescription,
                jobSkills,
                jobQualification,
                jobType,
                endDate
            },
            { new: true } 
        );

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ message: "Job successfully updated", job: updatedJob });

    } catch (error) {
        console.error("In Update referral controllers", error.name, ":", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = updateHire;
