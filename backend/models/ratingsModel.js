const mongoose = require("mongoose");

const updateRate = new mongoose.Schema(
  {
    isReason: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const rateModel = new mongoose.Schema(
  {
    finalRating: {
      type: String,
      require: true,
    },
    feedback: {
      type: String,
      require: true,
    },
    referralId: {
      type: String,
      require: true,
    },
    prevStatus: {
      type: String,
      require: true,
    },
    nextStatus: {
      type: String,
      require: true,
    },
    ratedBy: {
      type: String,
      require: true,
    },
    updateDetails: [updateRate],
    rejectedIn: {
      type: String,
      require: true,
    },
  },
  { timestamps: true, collection: "ratings_GD" }
);

const model_ratings = mongoose.model("round_groupDiscussion", rateModel);

module.exports = model_ratings;
