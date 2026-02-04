const mongoose = require("mongoose");

const scheduleMail = new mongoose.Schema(
  {
    mailSent: {
      type: Date,
      require: true,
      default: Date.now,
    },
    Total_Referral_id: {
      type: String,
      require: true,
    },
    roundDate: {
      type: Date,
      require: true,
    },
    sentBy: {
      type: String,
      required: true,
    }
  },
  { timestamps: true, collection: "Schedule_One" }
);

const model_One = mongoose.model("schedule_Round_one", scheduleMail);

module.exports = model_One;
