const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: true,
    },
    jobDescription: {
        type: String,
        required:true,
    },
    jobSkills: {
        type: String,
        required:true,
    },
    jobQualification: {
        type: String,
        required:true,
    },
    jobType: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date
    }
},  { timestamps: true, collection: "job_posting_referrals" })

const jobDetails = mongoose.model("datas",hiringSchema)

module.exports = jobDetails;