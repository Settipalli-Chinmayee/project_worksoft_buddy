const bcrypt = require("bcrypt");
const signupModel = require("../../models/signupModel.js")
const jwt = require("jsonwebtoken");


const resetPassword = async (req, res) => {
    // app.post("/api/v1/users/resetPassword", async (req, res) => {
    console.log("hi");
    const { token } = req.params; // Get token from URL
    const { newPassword } = req.body;
  
    if (!newPassword) {
      return res.status(400).json({
        sucess: false,
        message: "Password is Required!",
      });
    }
    console.log("Token received:", token);
    console.log("backend", req.body);
    // if(!email && !newPassword){
    //   console.log("nothing");
    // }
  
    try {
      // Verify Token
      const decoded = jwt.verify(token, process.env.RESET_TOKEN);
      // // console.log("Decoded token:", decoded);
      // if ( !newPassword) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "password required!" });
      // }
  
      const { newPassword } = req.body;
      console.log(newPassword);
  
      if (!decoded.email) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid token format!" });
      }
  
      console.log("New Password:", newPassword);
  
      // Check if user exists
      const userMailDecode = decoded.email.toLowerCase();
      const user = await signupModel.findOne({ email: userMailDecode });
      if (!user) {
        return res.status(404).json({ success: false, message: "No User Found" });
      }
  
      // Hash the new password before saving
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
      // Update the user's password in MongoDB
      await signupModel.findOneAndUpdate(
        { email: decoded.email },
        { newPassword: hashedPassword },
        { new: true }
      );
  
      console.log("Password updated successfully");
  
      return res.status(200).json({
        success: true,
        message: "Password updated successfully!",
      });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(400)
        .json({ success: false, message: "Invalid or expired token!" });
    }
  }


  module.exports = resetPassword;