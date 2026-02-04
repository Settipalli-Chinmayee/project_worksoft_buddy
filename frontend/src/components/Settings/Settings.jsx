import React, { useState, useEffect, useContext } from "react";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";
import { useAuth } from "../UserContext/UserContext";
import "./Settings.css";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import settingsIcon from "../../assets/images/profileImg-dark.svg";
import profileIcon from "../../assets/images/profileImg-light.svg";
// import { Toast } from "pri"

const Settings = ({ userId }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();
  // const userDetails = authState?.user;
  const { isTheme } = useContext(ThemeContext);
  const [updateBtn, setUpdateBtn] = useState(false);
  const [updateBtnPwd, setUpdateBtnPwd] = useState(false);
  const [updateLoginUserData, setUpdateLoginUserData] = useState([]);
  const [visible, setVisible] = useState(false); // for new password
  const [pwdVisible, setPwdVisible] = useState(false); // for confirm password
  const [oldpwdVisible, setOldPwdVisible] = useState(false); // for confirm password
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [resetError, setResetError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationText, setValidationText] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [focusedField, setFocusedField] = useState(null);
  const [oldPasswordError, setOldPasswordError] = useState("");

  const notify = () => toast.success("Wow so easy !");

  // const signupUserId =  authState?.userId;
  // console.log("settings", authState.userId);
  let info = localStorage.getItem("userDetails");
  // console.log("Info", info);
  const obj = JSON.parse(info);

  let signupUserId = obj.userId.trim(); // Output: Alice
  let mailId = obj.userEmail.trim(); // Output: Alice
  // console.log(mailId);

  // const [settings, setSettings] = useState(userDetails);
  const [settings, setSettings] = useState({
    username: "",
    email: "",
    department: "",
    password: "",
  });
  const validatePassword = (password) => {
    const minLength = 8;
    const maxLength = 16;
    const upperCase = /[A-Z]/.test(password);
    const lowerCase = /[a-z]/.test(password);
    const digits = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "Password must be atleast 8 Characters long";
    }
    if (password.length === maxLength) {
      return "Password cannot exceed 16 characters.";
    }
    if (!upperCase) {
      return "Password must contain atleast one uppercase character";
    }
    if (!lowerCase) {
      return "Password must contain atleast one lowercase character";
    }
    if (!digits) {
      return "Password must contain atleast one number";
    }
    if (!specialChar) {
      return "Password must contain atleast one special character";
    }
    return null;
  };
  // console.log(`http://localhost:3000/api/v1/referral/referralSignup/${signupUserId}`);
  // When userDetails changes, initialize form state
  // useEffect(() => {
  //   if (userDetails) {
  //     setSettings({
  //       username: userDetails.userName || "",
  //       email: userDetails.userEmail || "",
  //       department: userDetails.userDepartment || "",
  //       password: "",
  //     });
  //   }
  // }, [userDetails]);

  const handlePasswordChange = (e) => {
    console.log(e);
    setNewPassword(e.target.value);
    setErrorMessage("");
    const validationMessage = validatePassword(e.target.value);
    setValidationText(validationMessage);
  };

  const confirmPwdVisible = () => {
    setPwdVisible((prev) => !prev);
  };
  const oldPwdVisible = () => {
    setOldPwdVisible((prev) => !prev);
  };

  const passwordVisible = () => {
    setVisible((prev) => !prev);
  };

  useEffect(() => {
    if (!oldPassword) {
      setPasswordError("Old Passowrd needs to be updated");
    }
    if (!confirmPassword) {
      setPasswordError(""); // Clear error if confirmPassword is empty
    } else if (newPassword === confirmPassword) {
      setPasswordError(""); // No error if they match
    } else {
      setPasswordError("Passwords don’t match");
    }
  }, [newPassword, confirmPassword]);

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordError(""); // Clear error if confirmPassword is empty
    } else if (newPassword === confirmPassword) {
      setPasswordError(""); // No error if they match
    } else {
      setPasswordError("Passwords don’t match");
    }
  }, [newPassword, confirmPassword]);
  const getDataSignupUser = async () => {
    // e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/referral/referralSignup/${signupUserId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const newUser = await res.json();
      console.log("Calling onUpdateSuccess...");
      console.log("Referral added:", newUser);
      setUpdateLoginUserData(newUser);
    } catch (err) {
      console.error("Error adding referral:", err);
      alert("Error adding referral. Check console for more details.");
    }
  };
  useEffect(() => {
    getDataSignupUser();
  }, []);

  // const updateEachData = asyn
  // console.log
  // Fetch avatar when userDetails or username changes
  useEffect(() => {
    if (!settings.username) return;

    const fetchAvatar = async () => {
      try {
        const baseUrl = "https://api.dicebear.com/9.x/initials/svg";
        const params = new URLSearchParams({
          seed: settings.username,
          backgroundColor: "283e46",
          textColor: "ffc300",
          radius: "50",
        });

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        const svgText = await response.text();
        setAvatarUrl(`data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`);
      } catch (error) {
        console.error("Failed to fetch avatar:", error);
      }
    };

    fetchAvatar();
  }, [settings.username]);

  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target; //extract two properties from the event target (which is the HTML input element that triggered the event):
    console.log("value", value);
    setUpdateLoginUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    console.log("userId", signupUserId); // Should print the passed ID)

    // const validationMessage = validatePassword(newPassword);
    // // console.log()
    // if (validationMessage) {
    //   setValidationText(validationMessage);
    //   return;
    // }
    // console.log("personal Email", updateLoginUserData.personalEmail);
    // console.log(
    //   `http://localhost:3000/api/v1/referral/referralSignupEdit/${signupUserId}`
    // );
    const data = {
      // userName: updateLoginUserData.userName,
      personalEmail: updateLoginUserData.personalEmail,
      phoneNumber: updateLoginUserData.phoneNumber,
    };

    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/referral/referralSignupEdit/${signupUserId}`,
        {
          method: "PUT", // or POST depending on your backend
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      console.log("res", res);

      const response = await res.json();
      console.log("response", response);

      if (res.ok) {
        // alert("Profile updated successfully");
        toast.success("Your profile has been updated successfully");
        setUpdateBtn(false); // exit edit mode
      } else {
        // alert(data.message || "Failed to update profile");
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  //this function will update password
  const updateUserPassword = async () => {
    // Check if fields are empty

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      // alert("hello");
      return;
    }

    // Check if new and confirm password match
    if (newPassword !== confirmPassword) {
      setPasswordError("New Password and Confirm Password do not match.");
      return;
    }
    // console.log("old", oldPassword);
    // console.log("new", newPassword);
    try {
      // alert("in try block");
      const response = await fetch(
        `http://localhost:3000/api/v1/referral/referralSignupPassword/${signupUserId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      console.log(response);
      if (response.ok) {
        const result = await response.json();
        // setSuccessMessage(result.message);
        // setResetError(response.message);
        console.log("Success Message", result.message);
        toast.success(result.message, {
          autoClose: 1000,
        });
        setTimeout(() => navigate("/referralLogin"), 1200); // Smooth transition after success
      } else {
        const result = await response.json();
        // alert(oldPasswordError);
        setOldPasswordError(result.message);
        console.log("Error: ", result.message);
      }
    } catch (err) {
      console.error("Error adding referral:", err);
      alert("Error adding referral. Check console for more details.");
    }
  };

  // const handleSave = () => {
  //   console.log("Updated settings:", settings);
  //   // Call your API to save settings here
  // };

  return (
    <div className="main-container">
      <ReferralSidebar />
      <div className="main-content">
        <div className="table-container">
          <div className="user-management-section-one" style={{marginBottom:"0px"}}>
            <div className="pageHeadings">
              {avatarUrl && (
                <img
                  src={avatarUrl}
                  alt="User Avatar"
                  style={{ width: 24, height: 24, borderRadius: "50%" }}
                />
              )}{" "}
              <img
                src={isTheme ? settingsIcon : profileIcon}
                alt="Settings"
                title="Settings"
                style={{ width: "24px", height: "20px" }}
              />
              <h4 style={{ color: isTheme ? "white" : "#124265" }}>
                My Profile
              </h4>
              <br />
            </div>
          </div>
          {/* <button onClick={notify}>Hello</button> */}
          <div>
            {" "}
            <p
              style={{
                color: isTheme ? "gray" : "black",
                marginLeft: "2.3em",
                fontSize: "14px",
              }}
              className="sub-heading"
            >
              Manage your account and settings
            </p>
          </div>
          <div className="settings-container">
            <div className="firstBox">
              <div className="userProfile">
                <div>
                  <img
                    src="https://api.dicebear.com/9.x/thumbs/svg"
                    alt="avatar"
                    width={75}
                    className="avatarImage"
                  />
                </div>
                <div>
                  <p
                    className="userName"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    {/* {userDetails.userName || "Anonymous User"} */}
                    {updateLoginUserData.userName}
                  </p>
                  <p
                    className="userEmail"
                    style={{ color: isTheme ? "#90e0ef" : "#0096c7" }}
                  >
                    <a href={`mailto:${mailId}`}>{mailId}</a>
                  </p>
                </div>
              </div>
              {/* <div className="editBtnUser">
                <button
                 
                  className="job_post_btn"
                >
                  <span className="edit_post_job postIconJob"></span>
                  Edit
                </button>
              </div> */}
            </div>
            <div className="secondBox">
              {/* <p className="headerForSecondBox">Personal Information</p> */}

              <div
                className="headerForSecondBox"
                style={{ backgroundColor: isTheme ? "#343a40" : "#edede9" }}
              >
                <p style={{ color: isTheme ? "white" : "black" }}>
                  Personal Information
                </p>
                <button
                  className="editBtn"
                  onClick={() => {
                    setUpdateBtn(true);
                  }}
                >
                  <span className="edit_post_job postIconJob"></span>
                </button>
              </div>
              <div className="personal_info">
                <div className="secondBoxChild">
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      Full Name:
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      type="text"
                      name="email"
                      value={updateLoginUserData.userName}
                      onChange={handleChange}
                      className={`${updateBtn ? "" : "emailReadonly"}`}
                    />
                  </div>
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      Employee Id:
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      type="text"
                      name="email"
                      value={updateLoginUserData.empId}
                      onChange={handleChange}
                      className={`${updateBtn ? "" : "emailReadonly"}`}
                    />
                  </div>
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      Personal Email{" "}
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      type="email"
                      name="personalEmail"
                      placeholder="Enter Your Email "
                      value={updateLoginUserData.personalEmail || ""}
                      onChange={handleChange}
                      readOnly={!updateBtn}
                      className={`${updateBtn ? "" : "emailReadonly"}`}
                    />
                  </div>
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      Phone Number:
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      placeholder="Your Phone number"
                      value={updateLoginUserData.phoneNumber || ""}
                      onChange={handleChange}
                      type="text"
                      name="phoneNumber"
                      // readOnly={!updateBtn}
                      className={`${updateBtn ? "" : "emailReadonly"}`}
                      maxLength={10} // limit length at input level
                    />
                  </div>
                </div>
              </div>
              <div className="last-div">
                {updateBtn && (
                  <button
                    className="cancel-user-btn cancel-btn"
                    onClick={() => {
                      setUpdateBtn(false);
                    }}
                  >
                    <span className="cancel_btn cancel_icon_align "></span>
                    Cancel
                  </button>
                )}
                {updateBtn && (
                  <button
                    className="user-btn submitButton"
                    onClick={handleUpdateProfile}
                  >
                    {/* <span className="update_btn submit_icon_align"></span> */}
                    <span className="submit_btn submit_icon_align"></span>
                    Save Changes
                  </button>
                )}
              </div>
            </div>
            <div className="thirdBox">
              <div
                className="headerForSecondBox"
                style={{ backgroundColor: isTheme ? "#343a40" : "#edede9" }}
              >
                <p style={{ color: isTheme ? "white" : "black" }}>
                  Change Your Password
                </p>
                <button
                  className="editBtn"
                  onClick={() => {
                    setUpdateBtnPwd(true);
                  }}
                >
                  <span className="edit_post_job postIconJob"></span>
                </button>
              </div>
              <div className="personal_info">
                <div className="secondBoxChild">
                  {" "}
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      Old Password:
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      type={oldpwdVisible ? "text" : "password"}
                      name="oldPassword"
                      value={oldPassword}
                      onFocus={() => setFocusedField("oldPassword")}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                        if (e.target.value) {
                          setErrorMessage("");
                        }
                      }}
                      className={`${updateBtnPwd ? "" : "emailReadonly"}`}
                      // className="emailReadonly"
                    />
                    {updateBtnPwd && (
                      <img
                        className="pwdToggleIcon"
                        src={
                          oldpwdVisible
                            ? isTheme
                              ? "./src/assets/images/pwdOpenDark.svg"
                              : "./src/assets/images/pwdOpenIcon.svg"
                            : isTheme
                            ? "./src/assets/images/pwdCloseDark.svg"
                            : "./src/assets/images/pwdCloseIcon.svg"
                        }
                        onClick={oldPwdVisible}
                        // width="20"
                        alt="Toggle Password"
                      />
                    )}
                    {(() => {
                      console.log("updateBtnPwd:", updateBtnPwd);
                      console.log("focusedField:", focusedField);
                      console.log("oldPasswordError:", oldPasswordError);
                      console.log(
                        "oldPasswordError:",
                        JSON.stringify(oldPasswordError)
                      );

                      return null;
                    })()}
                    {updateBtnPwd && oldPasswordError?.trim() && (
                      <div
                        className="error-message-container"
                        style={{
                          visibility: "visible", // No need for visibility check anymore
                        }}
                      >
                        <img
                          src="./src/assets/images/error.svg"
                          className="error-icon"
                          alt="Error"
                        />
                        <p className="error-text">{oldPasswordError.trim()}</p>
                      </div>
                    )}
                  </div>
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      New Password:
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      type={visible ? "text" : "password"}
                      // type="password"
                      name="newPassword"
                      value={newPassword}
                      onFocus={() => setFocusedField("newPassword")}
                      onChange={handlePasswordChange}
                      className={`${updateBtnPwd ? "" : "emailReadonly"}`}
                    />
                    {updateBtnPwd && (
                      <img
                        className="pwdToggleIcon"
                        src={
                          visible
                            ? isTheme
                              ? "./src/assets/images/pwdOpenDark.svg"
                              : "./src/assets/images/pwdOpenIcon.svg"
                            : isTheme
                            ? "./src/assets/images/pwdCloseDark.svg"
                            : "./src/assets/images/pwdCloseIcon.svg"
                        }
                        onClick={passwordVisible}
                        // width="20"
                        alt="Toggle Password"
                      />
                    )}
                    {updateBtnPwd && focusedField === "newPassword" && (
                      <>
                        <div
                          className="error-message-container"
                          style={{
                            visibility:
                              passwordError || validationText
                                ? "visible"
                                : "hidden",
                          }}
                        >
                          <img
                            src="./src/assets/images/error.svg"
                            className="error-icon"
                            alt="Error"
                          />
                          <p className="error-text">
                            {validationText || passwordError || "\u00A0"}
                          </p>
                        </div>
                        {/* Show this if there is a passwordError or resetError */}
                        {/* {(passwordError || resetError) && (
                          <div
                            className={`error-container ${
                              passwordError || resetError
                                ? "visible-error"
                                : "hidden-error"
                            }`}
                          >
                            <img
                              src="/src/assets/images/error.svg"
                              className="error-icon"
                              alt="Error"
                            />
                            <p className="error-text">
                              {passwordError || resetError}
                            </p>
                          </div>
                        )} */}
                      </>
                    )}
                  </div>
                  <div className="nameFieldsSettings">
                    <label
                      className="labelCss"
                      style={{ color: isTheme ? "white" : "black" }}
                    >
                      Confirm Password:
                    </label>
                    <input
                      style={{
                        color: isTheme ? "#adb5bd" : "#343a40",
                        backgroundColor: isTheme ? "#495057" : "#f0f0f0",
                      }}
                      type={pwdVisible ? "text" : "password"}
                      name="confirmPassword"
                      value={confirmPassword}
                      onFocus={() => setFocusedField("confirmPassword")}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value) {
                          setErrorMessage("");
                        }
                      }}
                      className={`${updateBtnPwd ? "" : "emailReadonly"}`}
                    />
                    {updateBtnPwd && (
                      <img
                        className="pwdToggleIcon"
                        src={
                          pwdVisible
                            ? isTheme
                              ? "./src/assets/images/pwdOpenDark.svg"
                              : "./src/assets/images/pwdOpenIcon.svg"
                            : isTheme
                            ? "./src/assets/images/pwdCloseDark.svg"
                            : "./src/assets/images/pwdCloseIcon.svg"
                        }
                        onClick={confirmPwdVisible}
                        // width="20"
                        alt="Toggle Password"
                      />
                    )}
                    {updateBtnPwd && focusedField === "confirmPassword" && (
                      <>
                        {/* Show this only if there's no passwordError */}
                        {!passwordError && !resetError && (
                          <div
                            className="error-message-container"
                            style={{
                              visibility: validationText ? "visible" : "hidden",
                            }}
                          >
                            <img
                              src="./src/assets/images/error.svg"
                              className="error-icon"
                              alt="Error"
                            />
                            <p className="error-text">
                              {validationText || "\u00A0"}
                            </p>
                          </div>
                        )}

                        {/* Show this if there is a passwordError or resetError */}
                        {(passwordError || resetError) && (
                          <div
                            className={`error-container ${
                              passwordError || resetError
                                ? "visible-error"
                                : "hidden-error"
                            }`}
                          >
                            <img
                              src="/src/assets/images/error.svg"
                              className="error-icon"
                              alt="Error"
                            />
                            <p className="error-text">
                              {passwordError || resetError}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="last-div">
                {updateBtnPwd && (
                  <button
                    className="cancel-user-btn cancel-btn"
                    onClick={() => {
                      setUpdateBtnPwd(false);
                      setNewPassword("");
                      setOldPassword("");
                      setConfirmPassword("");
                    }}
                  >
                    <span className="cancel_btn cancel_icon_align "></span>
                    Cancel
                  </button>
                )}
                {updateBtnPwd && (
                  <button
                    className="user-btn submitButton"
                    onClick={updateUserPassword}
                  >
                    {" "}
                    <span className="submit_btn submit_icon_align"></span>
                    Save Changes
                  </button>
                )}
              </div>
            </div>

            {/* <button
              onClick={handleSave}
              className="invite-user-btn alignButton"
            >
              Save Settings
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
