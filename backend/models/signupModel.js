const mongoose = require("mongoose");

const signupSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true, // This trims whitespace
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,

      trim: true, // This trims whitespace
    },
    newPassword: {
      type: String,
      required: true,
      // unique:true,
      minlength: 8,
    },
  },
  { timestamps: true, collection: "signup_hrbot" }
);

const signupModel = mongoose.model("users", signupSchema);

module.exports = signupModel;
