const referralUsers = require("../../models/referralUser.js");
const referralsDetails = require("../../models/addingReferralModels.js");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // ignore certificate validation (not recommended for production)

function signupEmailTemplate(userName) {
  return `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Qualesce HR Referral Portal</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: fit-content;
            padding: 20px;
        }

        h2 {
            color: #333;
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
        <h2>Welcome, ${userName}!</h2>
        <p>Thank you for registering with <strong>Qualesce Referral Portal!</strong> Invite. Inspire. Impact.</p>
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


const referralSignup = async (req, res) => {
  // console.log("hi");
  // console.log(req.body);
  // console.log(req.body.newPassword);

  try {
    // const { userName, email, newPassword, department, role } = req.body;
    const { userName, email, newPassword, department, empId } = req.body;
    if (!userName || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }
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
        message: "Only users with a qualesce.com email can register!",
      });
    }

    // Ensure password is not undefined
    if (!newPassword) {
      return res.status(400).json({ message: "Password is required." });
    }

    // Check if email already exists
    let giveMailId = email.toLowerCase().trim();
    const existEmail = await referralUsers.findOne({ email: giveMailId });
    if (existEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const newUser = await referralUsers.create({
      userName,
      email: email.toLowerCase().trim(),
      newPassword: hashedPassword,
      department: department,
      empId: empId,
      // role: role,
    });
    console.log("users", )
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
    // Email Configuration
    const SignupHtmlBody = signupEmailTemplate(userName);
  // console.log("mails")

    // Email Configuration
    const emailConfig = {
      from: {
        name: "HR Referral Portal",
        address: process.env["SENDER_EMAIL"],
      },
      to: email, // Replace with recipient's email
      subject: "✅ You're In! Referral Portal Signup Successful",
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
    res.status(500).json({ message: "Internal Server Errors" });
  }
};

async function userRegistrationInfo(req, res) {
  try {
    const users = await referralUsers.find(); // Adjust to your DB logic
    // console.log("All signed-up users are displayed!");
    // console.log(users);
    const getThierReferrals = await referralsDetails.find(users.userName);
    // console.log(getThierReferrals);
    res.status(200).json({
      success: true,
      users,
      allReferrals: getThierReferrals,
    });

    // res.status(200).json({
    //   success: true,
    //   data: users,
    // });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

  // try {
  //   const getAllUsers = await referralUsers.find(); // Variable name can use camelCase
  //   console.log("All signed-up users are displayed!");
  //   console.log("all users=>".getAllUsers);

  //   res.status(200).json(getAllUsers);
  // } catch (error) {
  //   console.error("Error fetching users:", error); // More informative error logging
  //   res.status(500).json({ error: error.message });
  // }
}
async function userRegistrationDetails(req, res) {
  try {
    const users = await referralUsers.find(); // Adjust to your DB logic
    // console.log("All signed-up users are displayed!");
    // console.log(users);
    const getThierReferrals = await referralsDetails.find(users.userName);
    // console.log(getThierReferrals);
    res.status(200).json({
      success: true,
      users,
      allReferrals: getThierReferrals,
    });

    // res.status(200).json({
    //   success: true,
    //   data: users,
    // });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }

  // try {
  //   const getAllUsers = await referralUsers.find(); // Variable name can use camelCase
  //   console.log("All signed-up users are displayed!");
  //   console.log("all users=>".getAllUsers);

  //   res.status(200).json(getAllUsers);
  // } catch (error) {
  //   console.error("Error fetching users:", error); // More informative error logging
  //   res.status(500).json({ error: error.message });
  // }
}

// The below functions are to update or get the user profile info to change their details after login
const getIndividualUser = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("Fetching user with ID:", id);

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const user = await referralUsers.findById(id);
    // console.log("user BE", user);

    if (!user) {
      return res.status(404).json({ message: "Referral not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating referral:", error);
    res.status(400).json({ error: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params; // fix here

    const updateSignupUsers = await referralUsers.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateSignupUsers) {
      return res.status(404).json({ message: "Referral not found" });
    }

    // console.log("update", updateSignupUsers);
    res.status(200).json(updateSignupUsers);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

const updateUserProfilePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both old and new passwords are required." });
    }

    const user = await referralUsers.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the old password
    const isMatch = await bcrypt.compare(oldPassword, user.newPassword); // assuming field is newPassword

    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // Hash the new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in DB
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.newPassword = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: " Password updated! Kindly log in using your new password.",
    });
  } catch (error) {
    console.error("Error updating profile password:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await referralUsers.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Status updated", user: updated });
  } catch (err) {
    console.error("Error updating status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUserDept = async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;

    const updated_dept = await referralUsers.findByIdAndUpdate(
      id,
      { department },
      { new: true }
    );

    if (!updated_dept) {
      return res.status(404).json({ message: "User not found" });
    }

    return res
      .status(200)
      .json({ message: "Department updated", user: updated_dept });
  } catch (err) {
    console.error("Error updating department:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const updateRole = async (req, res) => {
  // console.log(req.body)
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updatedRole = await referralUsers.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Role updated", user: updatedRole });
  } catch (err) {
    console.error("Error updating user role:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  referralSignup,
  userRegistrationInfo,
  getIndividualUser,
  updateUserProfile,
  updateUserProfilePassword,
  updateUserStatus,
  updateUserDept,
  updateRole,
  userRegistrationDetails,
};
