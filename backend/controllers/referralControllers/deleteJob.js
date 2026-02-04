const JobDetails = require("../../models/jobDetails"); // Ensure this points to your Mongoose model

const deleteJob = async (req, res) => {
    // Extract the job ID from the URL parameters
    const { id } = req.params; // You should pass the ID in the URL, e.g., /deleteJob/:id
    
    if (!id) {
        return res.status(400).json({ message: "Job ID is required" });
    }

    try {
        // Find and delete the job by its ID
        const deletedJob = await JobDetails.findByIdAndDelete(id);

        // If no job was found, return a 404 error
        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Successfully deleted
        res.status(200).json({ message: "Job successfully deleted" });

    } catch (error) {
        console.error("Error in Delete referral controllers", error.name, ":", error.message);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = deleteJob;
