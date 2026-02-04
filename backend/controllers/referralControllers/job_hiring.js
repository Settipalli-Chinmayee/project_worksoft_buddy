const jobDetails = require("../../models/jobDetails");

const hiringPage = async (req, res) => {
  // console.log(req.body);
  try {
    const { jobTitle,jobDescription,jobSkills, jobQualification ,jobType,endDate } = req.body;
    const createJob = await jobDetails.create({
      jobTitle,
      jobDescription,
      jobSkills,
      jobQualification,
      jobType,
      endDate,
    });
    res.status(201).json({ message: "job added" });
  } catch (error) {
    console.error("In referral controllers" , error.name, ":", error.message);
  }
};

module.exports = hiringPage;
