import React, { useContext, useEffect, useState } from "react";
import { Navigate, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./SideBar.css";
import qLogo from "../../../src/assets/images/qlogo.svg";
import ReferralProfile from "../ReferralProfile/ReferralProfile";
// import qLogo from "../../assets/images/qLogo.svg";
import { useAuth } from "../UserContext/UserContext";
import lightThemeReferral from "../../assets/images/lightThemeReferral.svg";
import darkThemereferral from "../../assets/images/darkThemeReferral.svg";
import { ThemeContext } from "../ThemeContext/ThemeContext";

const ReferralSidebar = () => {
  const { authState } = useAuth();
  const { isTheme, toggleTheme } = useContext(ThemeContext);
  const [jobData, setJobData] = useState([]);

  // console.log("isHiring", jobData);

  const currentDate = new Date();
  //Sort the data
  const sortedJobs = [...jobData].sort((a, b) => {
    const aHiring = new Date(a.endDate) > currentDate;
    const bHiring = new Date(b.endDate) > currentDate;
    if (aHiring !== bHiring) return bHiring - aHiring;
    return new Date(b.endDate) - new Date(a.endDate);
  });
  // Get latest hiring date
  const latestHiringJob = sortedJobs.find(
    (job) => new Date(job.endDate) > currentDate
  );
  const latestHiringDate = latestHiringJob ? latestHiringJob.endDate : null;
  // console.log("latest Hiring Date", latestHiringDate);

  let stickerValue = latestHiringDate != null && "Hiring";

  // console.log("Auth state:", authState);
  const userName = authState?.user?.userName;
  const userRoleAccess = authState?.user?.userRole;
  const userId = authState?.user?.userId;
  const [profileShow, setProfileShow] = useState(false);
  const [switchTheme, setSwitchTheme] = useState(false);
  // const [userRoleAccess, setuserRoleAccess] = useState("");
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  // const [isTheme, setTheme] = useState(() => {return sessionStorage.getItem("referralTheme") || "light"});
  const profileToggle = () => setProfileShow((prev) => !prev);
  const navigate = useNavigate();
  useEffect(() => {
    userManagementInfo();
  }, [userId]);

  const fetchData = async () => {
    // console.log(userStatus, "user status in all jobs route");
    // const data = {userStatus}
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/allJobs",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setJobData(data);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const userManagementInfo = async () => {
    // console.log("referral sidebar")
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/referral/referralDetails",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: "include",
        }
      );
      if (!res.ok) {
        // navigate("/*")
        const errorData = await res.json();
        console.error("Server response:", errorData);
        throw new Error("Failed to fetch all signup users");
      }

      const result = await res.json();
      const users = result.users || [];
      const referrals = result.allReferrals || [];
      const currentUser = users.find((user) => user._id === userId);
      // console.log(currentUser?.role, "role");
      if (currentUser?.status === "Inactive") {
        navigate("/referralLogin");
        return;
      }
      // setuserRoleAccess(currentUser?.role, "role");
      if (currentUser?.role) {
  // Get existing userDetails from localStorage
  const existingDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

  // Update role
  const updatedDetails = {
    ...existingDetails,
    userRole: currentUser.role,
  };

  // Save back to localStorage
  localStorage.setItem("userDetails", JSON.stringify(updatedDetails));
}


      // console.log("All users:", users);
      // console.log("All referrals:", referrals);

      const userReferralsMap = {};

      // Create the mapping of user referrals
      users.forEach((user) => {
        const userName = user.userName;
        userReferralsMap[userName] = referrals.filter(
          (referral) => referral.referred_by === userName
        );
      });

      // console.log("User-specific referrals:", userReferralsMap);

      // setPassData(userReferralsMap);
    } catch (err) {
      console.error("Error in fetching details:", err);
      //   } finally {
      // setIsLoadingRole(false);
    }
  };
  // const toggleTheme = () => {
  //   setSwitchTheme((prev) => {
  //     const newTheme = !prev;
  //     setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  //     console.log("convert to dark theme");
  //     sessionStorage.setItem("referralTheme", newTheme ? "dark" : "light");
  //     return newTheme;
  //   });
  // };

  //  useEffect(() => {

  //   const savedTheme = sessionStorage.getItem("referralTheme") || "light";
  //   setTheme(savedTheme);
  // }, []);

  // const toggleTheme = () => {

  //   setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  // };

  useEffect(() => {
    sessionStorage.setItem("referralTheme", isTheme ? "dark" : "light");

    const bgColor = isTheme ? "black" : "white";
    const bg_Color = isTheme ? "#383737" : "#f7f7f7";

    const mainContent = document.getElementsByClassName("main-content")[0];
    if (mainContent) mainContent.style.backgroundColor = bgColor;

    const sidebar = document.getElementsByClassName("sidebar")[0];
    if (sidebar) sidebar.style.backgroundColor = bg_Color;

    // console.log("Theme changed to:", isTheme ? "dark" : "light");
  }, [isTheme]);

  // useEffect(() => {
  //   const savedTheme = sessionStorage.getItem("referralTheme") || "light";
  //   console.log("Saved theme:", savedTheme);
  //   if (savedTheme) {
  //     setTheme("dark");
  //   } else {
  //     setTheme("light");
  //   }
  // }, []);

  // if (isLoadingRole) {
  //   return null;
  // }

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-content">
          <div className="company_logo">
            <img
              className="qlogoImg"
              src={qLogo}
              style={{
                width: "50px",
              }}
            />
            <p style={{ color: isTheme ? "white" : "black" }}>
              Referral Portal
            </p>
          </div>
          <nav>
            {userRoleAccess === "Employee" ? (
              <ul className="sidebar-list">
                <li className="active">
                  <NavLink
                    to="/home"
                    activeclassname="active"
                    style={{ color: isTheme ? "#f7f7f7" : "black" }}
                  >
                    <span
                      className={`hiringIcon iconUser iconHome-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Home
                  </NavLink>
                </li>
                <li className="active">
                  <NavLink
                    to="/allJobs"
                    activeclassname="active"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`hiringIcon iconUser iconHire-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Job Postings
                    {stickerValue && (
                      <span className="hiring_sticker">{stickerValue}</span>
                    )}
                  </NavLink>
                </li>
                <li className="active">
                  <NavLink
                    to="/allReferrals"
                    activeclassname="active"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`referralIcon icon referralIcon-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Referrals
                  </NavLink>
                </li>
                <li className="active multiDropDownSec">
                  <NavLink
                    to="/department"
                    activeclassname="active"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`departmentIcon-${
                        isTheme ? "dark" : "light"
                      } icon`}
                    ></span>
                    Department
                  </NavLink>
                  {/* <div className="removeBackground">
                <span className="departmentIcon icon"></span>
                Departments
              </div> */}
                  <div className="multiDropDownContainer">
                    <NavLink to="/worsoftdept" activeclassname="active">
                      Worksoft
                    </NavLink>
                    <NavLink to="/blueprismdept" activeclassname="active">
                      Blueprism
                    </NavLink>
                    <NavLink to="/webdevdept" activeclassname="active">
                      Dev
                    </NavLink>
                  </div>
                </li>
                {/* <li className=" active">
                <NavLink to="/usermanagement" activeclassname="active">
                  <span className="userManagementIcon iconUser"></span>
                  User Management
                </NavLink>
              
              </li> */}
              </ul>
            ) : (
              <ul className="sidebar-list">
                <li className="active">
                  <NavLink
                    to="/home"
                    activeclassname="active"
                    style={{ color: isTheme ? "#f7f7f7" : "black" }}
                  >
                    <span
                      className={`hiringIcon iconUser iconHome-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Home
                  </NavLink>
                </li>
                <li className="active">
                  <NavLink
                    to="/allJobs"
                    activeclassname="active"
                    style={{ color: isTheme ? "#f7f7f7" : "black" }}
                  >
                    <span
                      className={`hiringIcon iconUser iconHire-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Job Postings
                    {stickerValue && (
                      <span className="hiring_sticker">{stickerValue}</span>
                    )}
                  </NavLink>
                </li>
                <li className="active">
                  <NavLink
                    to="/allReferrals"
                    activeclassname="active"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`referralIcon icon referralIcon-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Referrals
                  </NavLink>
                </li>
                <li className="active">
                  <NavLink
                    to="/current"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`screeningIcon icon screen-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    Referral Screening
                  </NavLink>
                </li>
                <li className="active multiDropDownSec">
                  <NavLink
                    to="/department"
                    activeclassname="active"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`departmentIcon-${
                        isTheme ? "dark" : "light"
                      } icon`}
                    ></span>
                    Departments
                  </NavLink>
                  {/* <div className="removeBackground">
                <span className="departmentIcon icon"></span>
                Departments
              </div> */}
                  <div className="multiDropDownContainer">
                    <NavLink to="/worsoftdept" activeclassname="active">
                      Worksoft
                    </NavLink>
                    <NavLink to="/blueprismdept" activeclassname="active">
                      Blueprism
                    </NavLink>
                    <NavLink to="/webdevdept" activeclassname="active">
                      Dev
                    </NavLink>
                  </div>
                </li>
                <li className=" active">
                  <NavLink
                    to="/usermanagement"
                    activeclassname="active"
                    style={{ color: isTheme ? "white" : "black" }}
                  >
                    <span
                      className={`userManagementIcon-${
                        isTheme ? "dark" : "light"
                      } iconUser`}
                    ></span>
                    User Management
                  </NavLink>
                  {/* <div className="removeBackground">
                <span className="userManagementIcon iconUser"></span>
                User Management
              </div> */}
                </li>
              </ul>
            )}
          </nav>
        </div>

        <div className="sidebar-profile">
          <div className="profileSection">
            <div></div>
            <div className="profileImage" onClick={profileToggle}>
              <img
                src="https://api.dicebear.com/9.x/thumbs/svg"
                alt="avatar"
                width={40}
              />

              {/* {profileShow ? (
            <img
              className="dropdownImage"
              src="../../../src/assets/images/dropdown.svg"
            />
          ) : (
            <img
              className="dropdownImage"
              src="../../../src/assets/images/dropuparrow.svg"
            />
          )} */}
            </div>
            <div className="profileRightSide">
              <div className="profileTheme">
                <div
                  className={`themeChange-${isTheme ? "dark" : "light"}`}
                  onClick={toggleTheme}
                >
                  <img
                    src={isTheme ? lightThemeReferral : darkThemereferral}
                    alt={
                      isTheme ? "Switch to Light Theme" : "Switch to Dark Theme"
                    }
                    title={
                      isTheme ? "Switch to Light Theme" : "Switch to Dark Theme"
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          {/* <ReferralProfile userName={userName} /> */}
        </div>
      </div>
      {profileShow && <ReferralProfile />}
    </>
  );
};

export default ReferralSidebar;
