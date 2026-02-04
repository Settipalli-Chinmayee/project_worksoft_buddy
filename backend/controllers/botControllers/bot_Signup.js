const signupModel = require("../../models/signupModel.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore certificate validation (not recommended for production)


function signupEmailTemplate(userName) {
  return `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Qualesce HR Bot</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 20px auto;
                    background: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                h2 {
                    color: #333;
                }
                p {
                    font-size: 16px;
                    color: #555;
                    line-height: 1.5;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #888;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Welcome, ${userName}!</h2>
                <p>Thank you for registering with <strong>Qualesce Worksoft Buddy</strong>! Your HR assistant is ready to help you manage tasks effortlessly.</p>
                <p class="footer">Best regards,<br><strong>Qualesce</strong></p>
            </div>
        </body>
        </html>
    `;
}


const signupPage = async (req, res) => {
    console.log(req.body);
    console.log(req.body.newPassword);
  
    try {
      const { userName, email, newPassword } = req.body;
      if (!userName || !email || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "All fields are required!",
        });
      }
      const allowedDomainEmail = (email) => {
        console.log("I am checking qaulese email id");
        const allowedDomain = "qualesce.com";
        const domainSplit = email.split("@")[1]?.toLowerCase();
        console.log(domainSplit);
        console.log(domainSplit === allowedDomain);
        return domainSplit === allowedDomain;
      };
  
      if (!allowedDomainEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Only users with a qualesce.com email can register!",
        });
      }
  
      // Ensure password is not undefined
      if (!newPassword) {
        return res.status(400).json({ message: "Password is required." });
      }
  
      // Check if email already exists
      let giveMailId = email.toLowerCase();
      const existEmail = await signupModel.findOne({ email: giveMailId });
      if (existEmail) {
        return res.status(400).json({ message: "Email already in use." });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      const newUser = await signupModel.create({
        userName,
        email: email.toLowerCase(),
        newPassword: hashedPassword,
      });
      const transporter = nodemailer.createTransport({
        // service: "gmail",
        host: "smtp.gmail.com",
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
      // Email Configuration
      const SignupHtmlBody = signupEmailTemplate(userName);
      // Email Configuration
      const emailConfig = {
        from: {
          name: "Worksoft Buddy",
          address: process.env["SENDER_EMAIL"],
        },
        to: email, // Replace with recipient's email
        subject: "✅ You're In! Worksoft Buddy Signup Successful",
        text: "Your signup is successful", // Plain text body
        html: SignupHtmlBody, // HTML body
      };
  
      // Call the sendMail function with the transporter and email configuration
      sendMail(transporter, emailConfig);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  module.exports = signupPage