const mongoose = require("mongoose");

const referralUser = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    newPassword: {
      type: String,
      required: true,
      // unique:true,
      minlength: 8,
    },
    department: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Employee", "Manager", "Lead"],
      default: "Employee",
      // required: true,
    },
    empId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    phoneNumber: {
      type: String,
      // enum: ["Active", "Inactive"],
      default: null,
    },
    personalEmail: {
      type: String,
      // unique: true,
      trim: true,
      lowercase: true,
      default: null,
    },
    referralCount: {
      type: Number,
      // enum : ["Active", "Inactive"],
      default: 0,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true, collection: "signup_referrals" }
);

const referralUsers = mongoose.model("referralUsers", referralUser);

module.exports = referralUsers;
