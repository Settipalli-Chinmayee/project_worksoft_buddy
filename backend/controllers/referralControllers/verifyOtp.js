const referralUsers = require("../../models/referralUser");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

async function verify_otp(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "Email and OTP required" });
  }

  try {
    // Find record by email and otp
    const record = await referralUsers.findOne({
      email: email.toLowerCase().trim(),
      otp,
    });

    if (!record) {
      return res
        .status(400)
        .json({ success: false, message: "OTP is invalid or does not match" });
    }

    // Check if OTP is expired
    if (new Date() > new Date(record.otpExpiresAt)) {
      // OTP expired: remove otp fields (unset)
      await referralUsers.updateOne(
        { _id: record._id },
        { $unset: { otp: "", otpExpiresAt: "" } }
      );

      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    // OTP valid: remove otp fields (unset)
    await referralUsers.updateOne(
      { _id: record._id },
      { $unset: { otp: "", otpExpiresAt: "" } }
    );

    // Find user by email
    const user = await referralUsers.findOne({ email: email.toLowerCase().trim()});

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    if (user.status !== "Active") {
      return res
        .status(403)
        .json({ success: false, message: "User is Inactive!" });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { email: email },
      process.env.JWT_REFRESH_KEY,
      { expiresIn: "7d" }
    );

    // Set cookies (use secure: false for local/dev if not using HTTPS)
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true only in production with HTTPS
      sameSite: "strict",
      // maxAge: 3600000, // 1 hour
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Respond with success and user info
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        email: user.email,
        // add other safe user info here
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function generateOtp(req, res) {
  // console.log(req.body);
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    const user = await referralUsers.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const generateOTP = (length = 6) => {
      const digits = "0123456789";
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      const allChars = digits + letters;
      let otp = "";
      otp += digits.charAt(Math.floor(Math.random() * digits.length));
      otp += letters.charAt(Math.floor(Math.random() * letters.length));
      for (let i = 2; i < length; i++) {
        otp += allChars.charAt(Math.floor(Math.random() * allChars.length));
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
          message: "OTP sent to your user email!",
        });
      })
      .catch((error) => {
        console.error("Error updating OTP in DB:", error);
        return res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      });
  } catch (error) {
    console.log(error.name, ":", error.message, "in generate OTP");
  }
}
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
            text-align:center;
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

module.exports = { verify_otp, generateOtp };
