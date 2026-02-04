const express = require("express");
const router = express.Router();
const signupPage = require("../controllers/botControllers/bot_Signup.js");
const loginPage = require("../controllers/botControllers/bot_Login.js");
const botQuery = require("../controllers/botControllers/bot_query.js");
const verifyToken = require("../middlewares/botMiddlewares/verifyToken.js");
const verify_login_token = require("../controllers/botControllers/verify_login_Token.js");
const forgotPassword = require("../controllers/botControllers/forgotPassword.js");
const resetPassword = require("../controllers/botControllers/resetPassword.js");
const { getQueries, getuserQueries, recentQueries, searchText } = require("../controllers/botControllers/getQueries.js");

router.post("/signup", signupPage);

router.post("/", loginPage);

router.get("/hrbot", verifyToken, verify_login_token);

router.get("/userQueries",getuserQueries)

router.post("/ask", botQuery);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword/:token", resetPassword);

router.get("/:id/getQuestion",recentQueries)

router.get("/:id/getQuestion/:val",searchText)

router.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  return res.json({ Logout: true });
});

module.exports = router;
