const mongoose = require("mongoose");

const driveSchema = new mongoose.Schema(
  {
    // drive_start: {
    //   type: Date,
    //   required: true,
    // },
    // drive_end: {
    //   type: Date,
    //   required: true,
    // },
    reason: {
      type: String,
      required: true,
    },
    completedBy:{
      type:String,
      required:true,
    }
  },
  { timestamps: true, collection: "Drive_Reasons" }
);

const driveModel = mongoose.model("DriveCompletion", driveSchema); 

module.exports = driveModel;
