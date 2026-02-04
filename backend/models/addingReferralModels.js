const { decrypt } = require("dotenv");
const mongoose = require("mongoose");

const RoundSchema = new mongoose.Schema(
  {
    round: {
      type: String,
      enum: ["Group Discussion", "Technical Assessment", "HR Round"],
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null,
    },
    status: {
      type: String,
      enum: ["Selected", "Rejected", null],
      default: null,
    },
  },
  { timestamps: true }
);
const ReferralSchema = new mongoose.Schema(
  {
    referral_fname: {
      type: String,
      required: true,
      trim: true,
    },
    referral_lname: {
      type: String,
      // required: true,
      trim: true,
    },
    referral_email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    rejectedIn: {
      type: String,
      require: true,
    },
    status: {
      type: String,

      enum: [
        "Submitted",
        "Emailed",
        "Group Discussion",
        "Technical Assessment",
        "HR Round",
        "Selected",
        "Rejected",
      ],
      default: "Submitted", // Default status
      trim: true,
    },
    mailStatus: {
      type: String,
      enum: ["Sent", "Not Sent"],
      default: "Not Sent",
    },
    currentRound: {
      type: String,
      enum: [
        "Group Discussion",
        "Technical Assessment",
        "HR Round",
        "GD + Technical",
        "—",
      ],
      default: "GD + Technical",
    },
    stage: {
      type: String,
      enum: ["New", "Old"],
      default: "New",
    },
    interviewResult: {
      type: String,
      enum: ["Pending", "Selected", "Rejected"],
      default: "Pending",
    },
    role_applied: {
      type: String,
      // enum: ["Manager", "Programmer Analyst Trainee", "Programmer Analyst"],
      required: true,
      trim: true,
    },
    department: {
      type: String,
      enum: ["Worksoft", "IA/RPA", "Web Development"],
      required: true,
      trim: true,
    },
    employment_type: {
      type: String,
      // enum: ["Full-Time", "Internship"],
      required: true,
      trim: true,
    },
    resume_file: {
      filename: String,
      mimetype: String,
      data: Buffer,
    },
    referred_by: {
      type: String,
      trim: true,

      //   required: true,
    },
    roundDate: {
      type: Date,
      default: null, // starts as null until scheduled
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },

    interviewRounds: {
      type: [RoundSchema],
      default: [{ round: "Group Discussion" }, { round: "Technical Assessment" }, { round: "HR Round" }],
    },
  },
  { timestamps: true, collection: "adding_referrals" }
);


let Referrals = mongoose.model("Referrals", ReferralSchema);

module.exports = Referrals;
