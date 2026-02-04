const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const CLUSTER_URI = process.env.CLUSTER_URI;

async function databaseConnection() {
  try {
    await mongoose.connect(CLUSTER_URI);
    console.info("Database is connected successfully!");
  } catch (err) {
    console.error(" Database connection failed in database.js:", err.message);
    throw err; 
  }
}

module.exports = databaseConnection;
