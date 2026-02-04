const signupModel = require("../../models/signupModel.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore certificate validation (not recommended for production)


function getPasswordResetEmail(userName, resetLink) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reset Your Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; text-align: center; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 500px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #283E46;">Reset Your Password</h2>
            <p>Hi <strong>${userName}</strong>,</p>
            <p>We received a request to reset your password for your <strong>Qualesce HR Bot</strong> account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; color: white; background-color: #283E46; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
            <p>Best regards,</p>
            <p><strong>Qualesce</strong></p>
        </div>
    </body>
    </html>
  `;
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  const userMailId = email.toLowerCase();
  console.log("userMailID", userMailId);

  if (!userMailId) {
    return res.status(404).json({ message: "An email address is required." });
  }

  const email_Present = await signupModel.findOne({ email: userMailId });
  console.log(email_Present);

  if (!email_Present) {
    console.log("email not in db");
    return res.status(404).json({
      message: "Email not recognized. Please enter a registered email or sign up.",
    });
  }

  const token = jwt.sign({ email: email }, process.env.RESET_TOKEN, {
    expiresIn: "1hr",
  });

  const resetURL = `https://blogbuddyv1.qualesce.com/resetPassword/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
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
    //   console.log("Email sent: " + info.response);
      // Send the success response only after email is sent
      return res.status(200).json({
        success: true,
        message: "Email sent successfully!",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      // Send error response if sending fails
      return res.status(500).json({ message: "Error sending email" });
    }
  };

  // Email Configuration
  const htmlBody = getPasswordResetEmail(email, resetURL);
  const emailConfig = {
    from: {
      name: "HR Bot",
      address: process.env["SENDER_EMAIL"],
    },
    to: email, // Replace with recipient's email
    subject: "Password Reset",
    text: "Password reset link", // Plain text body
    html: htmlBody,
  };

  // Call the sendMail function with the transporter and email configuration
  await sendMail(transporter, emailConfig); // Ensure the async function is awaited here
};

module.exports = forgotPassword;
