import React from "react";
import { useState, useEffect } from "react";
import "./ViewProfileReferral.css";
import { useAuth } from "../UserContext/UserContext";

const ViewProfileReferral = () => {
  const { authState } = useAuth();
  //   console.log("Auth state:", authState);
  const userDetails = authState.user;
  console.log(userDetails);
  const [avatarUrl, setAvatarUrl] = useState("");
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

  const updateUserData = async (data) => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/referralLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      // console.log("User updated:", result);
      return result;
    } catch (error) {
      console.error("Error updating user:", error);
      // Handle error appropriately here
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // console.log("Updated settings:", settings);
    // You can call an API to update settings here
  };
  return (
    <>
      <div className="modal-overlay">
        <div className="view-modal-box" >
          <div className=" view-profile-container">
            {/* <div className="topSection">
             
            </div> */}
             <img
                src={avatarUrl}
                alt="User Avatar"
                width={50}
                className="avatarImageView"
              />

            <div>
              {/* <label className="labelCss">Username:</label> */}
              <h2 className="viewUserName">{userDetails.userName}</h2>
              {/* <input
                type="text"
                name="username"
                value={userDetails.userName}
                onChange={handleChange}
              /> */}
            </div>

            <div className="nameFieldsSettings">
              <label className="labelCss">Email:</label>
              <input
                type="email"
                name="email"
                value={userDetails.userEmail}
                onChange={handleChange}
                className="emailReadonly"
              />
            </div>
            <div className="nameFieldsSettings">
              <label className="labelCss">Department:</label>
              <input
                type="email"
                name="email"
                value={userDetails.userDepartment}
                onChange={handleChange}
                className="emailReadonly"
              />
            </div>
            {/* <div className="nameFieldsSettings">
                <label className="labelCss">Theme:</label>
                <select
                  name="theme"
                  value={settings.theme}
                  onChange={handleChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div> */}

            {/* <button
              onClick={handleSave}
              className="invite-user-btn alignButton"
            >
              Save Settings
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewProfileReferral;
