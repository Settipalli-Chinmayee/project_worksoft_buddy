require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());


const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken; // Look for the token in the cookies
  // console.log(token)
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied, no token provided" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Verify the token
      req.user = decoded; // Attach decoded token info to request
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" }); // Token is invalid or expired
    }
  };

  module.exports = verifyToken