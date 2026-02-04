const jwt = require("jsonwebtoken");
const referralUsers = require("../../models/referralUser");

const roleAccess = async (req, res, next) => {
  const token = req.cookies.accessToken;
  // console.log(token)
  // console.log(!token)
  // if (!token) {
    // return res.status(401).json({ error: "No access token" });
    if (!token) {
      res.clearCookie("accessToken");
      return res
        .status(401)
        .json({ logout: true, message: "No access token, user logged out" });
    // }
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const email = payload.email;
  
    // console.log(payload)
    const userRole = await referralUsers.findOne({ email: email.toLowerCase()});
    if (!userRole) {
      return res
        .status(403)
        .json({ error: "Access forbidden: insufficient permissions" });
    }
    // console.log(userRole.role)
    if (userRole.role === "Employee") {
      return res.status(403).json({ error: "Unauthorized: Admins only" });
    }
    next();
  } catch (error) {
    console.error(
      "Error in role access middleware:",
      error.name,
      ":",
      error.message
    );
    // return res.status(401).json({ error: "Invalid token" });
    res.clearCookie("accessToken");
    return res.status(401).json({ logout: true, error: "Invalid or expired token, user logged out" });
  }
};

module.exports = roleAccess;
