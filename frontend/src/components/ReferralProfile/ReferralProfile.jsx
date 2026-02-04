import React, { useContext, useEffect, useState } from "react";
import "./ReferralProfile.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../UserContext/UserContext";
import settingsIcon from "../../assets/images/profileImg-dark.svg";
import profileIcon from "../../assets/images/profileImg-light.svg";
import ViewProfileReferral from "../ViewProfileReferral/ViewProfileReferral";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";

const ReferralProfile = () => {
  const navigate = useNavigate();
  const { logout, authState } = useAuth();
  const [viewProfile, setViewProfile] = useState(false);
  const userDetails = authState?.user || {};
  const { isTheme } = useContext(ThemeContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  const toggleViewProfile = () => {
    setViewProfile((prev) => !prev);
  };

  // Fetch avatar from DiceBear using userName
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!userDetails.userName) return;

      try {
        const baseUrl = "https://api.dicebear.com/9.x/initials/svg";
        const params = new URLSearchParams({
          seed: userDetails.userName,
          backgroundColor: "e1f2ef", // yellow
          textColor: "283e46",

          radius: "50", // circular
        });

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const svgText = await response.text();
        setAvatarUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`);
      } catch (error) {
        console.error("Failed to fetch avatar:", error);
      }
    };

    fetchAvatar();
  }, [userDetails.userName]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/referralLogout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        await logout(); // Call context logout
        navigate("/referrallogin"); // Redirect to login
        toast.success("Logged out successfully!");
      } else {
        console.error("Logout failed. Status:", response.status);
        toast.success("Logout of failed!");
      }
    } catch (err) {
      console.error("Logout request error:", err);
    }
  };

  return (
    <>
      <div
        className="profileDetails"
        style={{ backgroundColor: isTheme ? "black" : "#f7f7f7" }}
      >
        <div className="profileInfo">
          <div>
            {/* <img
              src={avatarUrl}
              alt="User Avatar"
              width={50}
              className="avatarImage"
            /> */}
            <img
              src="https://api.dicebear.com/9.x/thumbs/svg"
              alt="avatar"
              width={40}
              className="avatarImage"
            />
          </div>
          <div>
            <p
              className="profileName"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              {userDetails.userName || "Anonymous User"}
            </p>
            <p className="profileEmail">
              {userDetails.userEmail || "No Email Provided"}
            </p>
          </div>
        </div>

        <div className="profileInfoSecond">
          <div className="profileSettings">
            <NavLink
              to="/settings"
              className="accountSettings"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              <span>
                <img
                  src={isTheme ? settingsIcon : profileIcon}
                  alt="Settings"
                  title="Settings"
                  
                />
              </span>
              My Profile
            </NavLink>
          </div>
        </div>

        <button className="logoutButton" onClick={handleLogout}>
          <span className="logoutImg"></span>
          Logout
        </button>
      </div>

      {viewProfile && <ViewProfileReferral />}
    </>
  );
};

export default ReferralProfile;
