const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    userQuery: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "blog_queries" }
);

const queryDetails = mongoose.model("Query_Data",querySchema)

module.exports = queryDetails;
