const express = require("express");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const hiringPage = require("../controllers/referralControllers/job_hiring");
const hiringData = require("../middlewares/referralMiddlewares/jobHiringDetatils");
const getJobs = require("../controllers/referralControllers/allJobs");
const updateHire = require("../controllers/referralControllers/updateJobs");
const deleteJob = require("../controllers/referralControllers/deleteJob");
const referralLogin = require("../controllers/referralControllers/referralLogin");
const {
  referralSignup,
  userRegistrationInfo,
  getIndividualUser,
  updateUserProfile,
  updateUserProfilePassword,
  updateUserStatus,
  updateUserDept,
  updateRole,
  userRegistrationDetails,
} = require("../controllers/referralControllers/referralSignup");
const upload = require("../middlewares/referralMiddlewares/multerMiddleware");
const {
  addingReferrals,
  getAllRefferals,
  updateIndividualReferrals,
  updateReferrals,
  postResume,
} = require("../controllers/referralControllers/referralsControllers");
const departmentPage = require("../controllers/referralControllers/org_department");
const getDept = require("../controllers/referralControllers/allDepartments");
const updateDept = require("../controllers/referralControllers/updateDepartments");
const {
  addSubDepartments,
} = require("../controllers/referralControllers/subDepartments");
const allCurrent = require("../controllers/referralControllers/allCurrent");
const driveComplete = require("../controllers/referralControllers/driveComplete");
const {
  scheduleOne,
  getAllSchedulesMailList,
} = require("../controllers/referralControllers/scheduleMails");
 const {
  ratings,
  fetchRatings,
  updateRatings,
  getMail,
  rateDetails,
  getThatReferDeatils
} = require("../controllers/referralControllers/ratings");
const {
  verify_otp,
  generateOtp,
} = require("../controllers/referralControllers/verifyOtp");
const roleAccess = require("../middlewares/referralMiddlewares/roleAccess");
// const userStatus = require("../middlewares/referralMiddlewares/userStatus");
const router = express.Router();

router.post("/referralSignup", referralSignup);
router.get("/referralSignup",roleAccess,userRegistrationInfo);
router.get("/referralDetails",userRegistrationDetails);
router.get("/referralSignup/:id", getIndividualUser);
router.put("/referralSignupEdit/:id", updateUserProfile); // this will update the signup users data
router.post("/referralSignupPassword/:id", updateUserProfilePassword); // this will update the signup users data
router.put("/updateStatus/:id", updateUserStatus); // this will update the signup users data

router.post("/referralLogin", referralLogin);

router.post("/hiring", hiringData, hiringPage);

router.get("/allJobs", getJobs);
// router.get("/allJobs", userStatus, getJobs);

router.put("/hiringEdit/:id", hiringData, updateHire);

router.delete("/deleteJob/:id", deleteJob);

router.post("/addDepartments", departmentPage);
router.get("/department", getDept);
router.put("/updateDepartments/:id", updateDept);

router.put("/addSubDepartments/:id", addSubDepartments);
router.put("/addSubDepartments/:id/:val", addSubDepartments);

router.post("/allReferrals", upload.single("resume_file"), addingReferrals); //upload.single("resume_file") =>resume_file should match the key of from data.
router.get("/allReferrals", getAllRefferals);
router.put("/allReferrals/:id", updateIndividualReferrals);
router.get("/currentReferrals", roleAccess, allCurrent);
router.post("/driveComplete", driveComplete);
router.put("/updateallReferrals", updateReferrals);
router.post("/scheduleOne", scheduleOne);
router.get("/getAllSchedulesMailList", roleAccess, getAllSchedulesMailList);
router.post("/round", ratings);


router.get("/ratings/:id/:val", fetchRatings);
router.put("/roundUpdate/:id/:val", updateRatings);
router.get("/ratings/:id", getThatReferDeatils); // to get that individual id

router.get("/mail/:type", getMail);
router.post("/otp", verify_otp);
router.post("/resendOtp", generateOtp);
router.get("/rate/:val/:id", rateDetails);
router.post(
  "/allReferrals/:id/uploadResume",
  upload.single("resume_file"),
  postResume
);
router.put("/updateDept/:id", updateUserDept);
router.put("/updateRole/:id", updateRole);

router.post("/referrallogout", (req, res) => {
  res.clearCookie("accessToken");
  return res.json({ Logout: true });
});

module.exports = router;
