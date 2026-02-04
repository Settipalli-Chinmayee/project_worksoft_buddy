const fs = require("node:fs");
const os = require("os");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const referralUsers = require("../../models/referralUser.js");

// const path = "logs/Referral_Portal_Logs.log";

const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore certificate validation (not recommended for production)

function signupEmailTemplate(otp) {
  return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Qualesce HR Bot</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: fit-content;
            margin: 20px auto;
            padding: 20px;
        }

        h2 {
            color: #333;
            text-align: center;
        }

        p {
            font-size: 16px;
            color: #555;
            line-height: 1.5;
        }

        span {
            line-height: 1.9;
            font-size: 12px;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Verify OTP to login</h2>
        <p>OTP to Login into HR Referral Portal : ${otp}</p>
        <p class="footer">Best regards,<br><strong>Qualesce</strong><br><img
                src="https://www.qualesce.com/img/QLogo.svg" alt="Qualesce Logo" style="height:40px; margin-top: 5px;">
        </p>
        <div>
            <span>Qualesce India Pvt Ltd.</span><br>

            <span>#628a, Above Canara Bank,1st Stage Indiranagar, Bengaluru, Karnataka 560038, India.</span><br>

            <span>Website: <a href="https://www.qualesce.com">www.qualesce.com</a></span>
        </div>
    </div>
</body>

</html>
    `;
}

const referralLogin = async (req, res) => {
  // console.log("attempted");
  const { email, password } = req.body;
  // console.log(req.body);
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
  const logs = path.join(__dirname, "..", "..", "logs");
  const logFile = path.join(logs, "Referral_Portal_Logs.log");
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

    if (!fs.existsSync(logFile)) {
      let file_header = "Date, location, IP, User, Error";

      fs.writeFile(logFile, file_header, function (err, data) {
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

  fs.appendFile(logFile, "\n" + append_file, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("successfully append");
    }
  });

  fs.readFile(logFile, "utf8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(data);
    }
  });
  if (!email || !password) {
    // console.log(email, ",", password);
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required!" });
  }
  // console.log("here....", email);

  const allowedDomainEmail = (email) => {
    // console.log("I am checking qaulese email id");
    const allowedDomain = "qualesce.com";
    const domainSplit = email.split("@")[1]?.toLowerCase().trim();
    // console.log(domainSplit);
    // console.log(domainSplit === allowedDomain);
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

  referralUsers.findOne({ email: email.toLowerCase().trim() }).then((user) => {
    // console.log("found one", email);
    // console.log("found one", user);

    if (user) {
      if (user.status === "Active") {
        // console.log(`User ID: ${user._id}`);
        // console.log(`User ID: ${user.status}`);
        bcrypt.compare(password, user.newPassword, (err, isMatch) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Error comparing passwords." });
          }
          if (isMatch) {
            // console.log("hi")
            // const accessToken = jwt.sign(
            //   { email: email },
            //   process.env.JWT_SECRET_KEY,
            //   { expiresIn: "1h" }
            // );
            // const refreshToken = jwt.sign(
            //   { email: email },
            //   process.env.JWT_REFRESH_KEY,
            //   { expiresIn: "7d" }
            // );

            // res.cookie("accessToken", accessToken, {
            //   httpOnly: true,
            //   secure: true,
            //   sameSite: "strict",
            // });
            // res.cookie("refreshToken", refreshToken, {
            //   httpOnly: true,
            //   secure: true,
            //   sameSite: "strict",
            // });
            const generateOTP = (length = 6) => {
              const digits = "0123456789";
              const letters =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
              const allChars = digits + letters;
              let otp = "";
              otp += digits.charAt(Math.floor(Math.random() * digits.length));
              otp += letters.charAt(Math.floor(Math.random() * letters.length));
              for (let i = 2; i < length; i++) {
                otp += allChars.charAt(
                  Math.floor(Math.random() * allChars.length)
                );
              }
              otp = otp
                .split("")
                .sort(() => 0.5 - Math.random())
                .join("");
              return otp;
            };

            const otp = generateOTP();
            const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);

            // console.log(otp, "OTP");

            referralUsers
              .findByIdAndUpdate(user._id, { otp, otpExpiresAt }, { new: true })
              .then(() => {
                const transporter = nodemailer.createTransport({
                  // service: "gmail",
                  host: "smtp.office365.com",
                  port: 587,
                  secure: false,
                  auth: {
                    user: process.env["SENDER_EMAIL"],
                    pass: process.env["SENDER_PASSWORD"],
                  },
                });

                const sendMail = async (transporter, emailConfig) => {
                  try {
                    const info = await transporter.sendMail(emailConfig);
                    // console.log("Email sent successfully:", info);
                  } catch (error) {
                    console.error("Error sending email:", error);
                  }
                };
                const SignupHtmlBody = signupEmailTemplate(otp);
                const emailConfig = {
                  from: {
                    name: "HR Referral Portal",
                    address: process.env["SENDER_EMAIL"],
                  },
                  to: email, // Replace with recipient's email
                  subject: "Login OTP",
                  text: " OTP to Login",
                  html: SignupHtmlBody,
                };
                sendMail(transporter, emailConfig);

                // return res.status(200).json({ Login: true, Authentication: true });
                return res.status(200).json({
                  success: true,
                  Authentication: true,
                  userEmail: email,
                  userName: user.userName,
                  userRole: user.role,
                  userId: user._id,
                  userDepartment: user.department,
                  status: user.status,
                  message: "OTP sent to your user email!",
                });
              })
              .catch((error) => {
                console.error("Error updating OTP in DB:", error);
                return res
                  .status(500)
                  .json({ success: false, message: "Internal server error" });
              });
          } else {
            return res.status(401).json({ message: "Incorrect password." });
          }
        });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "User is Inactive!" });
      }
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  });
};

module.exports = referralLogin;
