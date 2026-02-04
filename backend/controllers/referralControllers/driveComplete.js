const driveModel = require("../../models/driveCompletion");

const driveComplete = async (req, res) => {
  
  try {
    // const { drive_start, drive_end, reason } = req.body;
    const { reason,completedBy } = req.body;
    // if (!drive_start || !drive_end || !reason) {
    if (!reason) {
      return res
        .status(400)
        .json({
          error: "Missing required fields: reason",
        });
    }

    const driveEnd = await driveModel.create({
      reason,
      completedBy
    });

    res.status(200).json(driveEnd);
  } catch (error) {
    console.error("Error in driveComplete = ", error.name, ":", error.message);
    res.status(500).json({ error: "Failed to complete the drive" });
  }
};

module.exports = driveComplete;
