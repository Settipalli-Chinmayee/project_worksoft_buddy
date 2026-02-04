const signupModel = require("../../models/signupModel.js");
const fs = require("node:fs");
const os = require("os");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const path = "userLogs.log";

const loginPage = async(req, res) => {
    console.log("attempted");
    const { email, password } = req.body;
    console.log(req.body);
    // if(!)
    // const userName = os.userInfo().username;
    // console.log(userName)
    const os_data = os;
    let error_produce = "NA";
    let current_date = "";
    let user_name = "";
    let action = "";
    let location = "";
    // console.log("os", os_data.hostname());
  
    let ip_add = "";
    let device = "";
    let formated_date = "";
    try {
      // console.log(new Date);
      let year = new Date().getFullYear();
      let day = new Date().getDate();
      let timezone = new Date().toString();
      let date_arr = timezone.split(" ");
      // console.log(date_arr)
      let times = new Date().toLocaleTimeString();
      let month = date_arr[1];
  
      formated_date = day + "/" + month + "/" + year + " " + times;
      // console.log("date", formated_date)
      for (let i = 5; i < date_arr.length; i++) {
        location += " " + date_arr[i];
      }
      user_name = os.userInfo().username;
      let ip_address = os.networkInterfaces();
      // console.log(ip_address);
      ip_add = ip_address["Wi-Fi"][1].address;
      //  ip_add = ip_address;
  
      device = os_data.hostname();
  
      if (!fs.existsSync("logs/userLogs.log")) {
        let file_header = "Date, location, IP, User, Error";
        fs.writeFile("userLogs.log", file_header, function (err, data) {
          if (err) {
            console.log("error handling", err);
          } else {
            console.log("data saved", data);
          }
        });
        console.log("fill writtern successfully");
      } else {
        console.log("already exist");
      }
    } catch (err) {
      error_produce = err;
    }
    let append_file =
      formated_date +
      "," +
      location +
      "," +
      os_data.hostname() +
      "," +
      ip_add +
      "," +
      user_name +
      "," +
      error_produce;
  
    fs.appendFile("userLogs.log", "\n" + append_file, (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log("successfully append");
      }
    });
  
    fs.readFile("userLogs.log", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(data);
      }
    });
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required!" });
    }
    console.log("here....", email);
  
    const allowedDomainEmail = (email) => {
      console.log("I am checking qaulese email id");
      const allowedDomain = "qualesce.com";
      const domainSplit = email.split("@")[1]?.toLowerCase().trim();
      console.log(domainSplit);
      console.log(domainSplit === allowedDomain);
      return domainSplit === allowedDomain;
    };
  
    if (!allowedDomainEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Only users with a qualesce.com email can login!",
      });
    }
    //  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    //     if (!emailRegex.test(email)) {
    //       return res.status(400).json({
    //         success: false,
    //         message: "Invalid email format!",
    //       });
    //     }
  
    signupModel.findOne({ email: email.toLowerCase() }).then((user) => {
      console.log("found one", email);
  
      if (user) {
        console.log(`User ID: ${user._id}`);
        bcrypt.compare(password, user.newPassword, (err, isMatch) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error comparing passwords." });
          }
          if (isMatch) {
            const accessToken = jwt.sign(
              { email: email },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "1h" }
            );
            const refreshToken = jwt.sign(
              { email: email },
              process.env.JWT_REFRESH_KEY,
              { expiresIn: "7d" }
            );
  
            res.cookie("accessToken", accessToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            });
            res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "strict",
            });
  
            // return res.status(200).json({ Login: true, Authentication: true });
            return res.status(200).json({
              success: true,
              Authentication: true,
              userEmail: email,
              userName: user.userName,
              userId:user._id,
              message: "Logged in Successfully!",
            });
          } else {
            return res.status(401).json({ message: "Incorrect password." });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      }
    });
  }


  module.exports = loginPage