const Referrals = require("../../models/addingReferralModels");

const allCurrent = async (req, res) => {
  try {
    const currentReferral = await Referrals.find({stage:"New"});
    // console.log(job_Details)
    res.status(200).json(currentReferral);
  } catch (error) {
    console.error("Error in allCurrents = ", error.name, ":", error.message);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
};

module.exports = allCurrent;
