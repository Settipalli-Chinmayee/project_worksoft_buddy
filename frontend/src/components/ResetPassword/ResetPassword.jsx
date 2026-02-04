import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Footer from "../../commonFolder/Footer/Footer";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; //npm install jwt-decode
import loginAfterHover from "../../assets/images/loginAfterHover.svg";
import login from "../../assets/images/login.svg";
import qlogo from "../../assets/images/qlogo.svg";
import error from "../../assets/images/error.svg";
import pwdOpenIcon from "../../assets/images/pwdOpenIcon.svg";
import pwdCloseIcon from "../../assets/images/pwdCloseIcon.svg";
// import pwdOpenDark from "../../assets/images/pwdOpenDark.svg";
// import pwdCloseDark from "../../assets/images/pwdCloseDark.svg";
import sucess from "../../assets/images/success.svg";

const ResetPassword = () => {
  document.title = "HR BOT | Reset Password";

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isConfirmPassword, setIsConfirmPassword] = useState(false);
  const [visible, setVisible] = useState(false); // for new password
  const [pwdVisible, setPwdVisible] = useState(false); // for confirm password
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [validationText, setValitationText] = useState(null);
  const [passwordError, setPasswordError] = useState("");
  const [resetError, setResetError] = useState("");
  const { token } = useParams(); // To get token from url
  const navigate = useNavigate();
  const [activeBtn, setActiveBtn] = useState(false);
  // console.log("frontend token", token)
  const [searchParams] = useSearchParams(); // Get URL parameters
  const expires = searchParams.get("expires"); // Get expiration timestamp from URL
  if (!token) {
    // Redirect to login or error page
    return <Navigate to="/login" replace />;
  }
  console.log(expires);
  let decodeEmail = "";
  try {
    const decode = jwtDecode(token);
    // console.log(decode);
    decodeEmail = decode.email;
  } catch (error) {
    console.log("Invalid token", error);
  }

  const validatePassword = (newPassword) => {
    const minLength = 8;
    const maxLength = 16;
    const upperCase = /[A-Z]/.test(newPassword);
    const lowerCase = /[a-z]/.test(newPassword);
    const digits = /\d/.test(newPassword);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (newPassword.length < minLength) {
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

  const updatePassword = async (e) => {
    // console.log("here")
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setResetError("Password is required!");
      return;
    }

    if (newPassword === confirmPassword) {
      const validationMessage = validatePassword(newPassword);
      setValitationText(validationMessage);
      console.log(validationMessage);

      if (validationMessage) {
        setFormValid(false);
        return;
      }
      setFormValid(true);
      if (e.isTrusted) {
        setActiveBtn(true);
        setTimeout(async () => {
          const data = { email, newPassword };
          console.log("DATA", data);

          // Add API call or any further actions here
          try {
            const response = await fetch(
              `https://blogbuddyv1api.qualesce.com/api/v1/users/resetPassword/${token}`,
              {
                // const response = await fetch(`http://localhost:3000/api/v1/users/resetPassword`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
                credentials: "include",
              }
            );
            console.log(response);
            // console.log('token',token)
            if (response.ok) {
              const result = await response.json();
              setSuccessMessage(result.message);
              // setResetError(response.message);
              console.log(result.message);
              setTimeout(() => navigate("/login"), 2500); // Smooth transition after success
            } else {
              setResetError(response.message || "Reset link expired");
              console.log("Error: ", response.status);
            }
          } catch (error) {
            setResetError("Something went wrong. Please try again.");
            console.error(error);
          } finally {
            setActiveBtn(false);
          }
        }, 2000);
      }
    } else {
      console.log("Passwords do not match.");
    }
  };

  useEffect(() => {
    if (!confirmPassword) {
      setPasswordError(""); // Clear error if confirmPassword is empty
    } else if (newPassword === confirmPassword) {
      setPasswordError(""); // No error if they match
    } else {
      setPasswordError("Passwords don’t match");
    }
  }, [newPassword, confirmPassword]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    setResetError("");
    const validationMessage = validatePassword(e.target.value);
    setValitationText(validationMessage);
  };
  const passwordVisible = () => {
    setVisible((prev) => !prev);
  };
  const confirmPwdVisible = () => {
    setPwdVisible((prev) => !prev);
  };

  const loginButtonAfterHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = loginAfterHover;
    }
  };

  const loginButtonBeforeHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = login;
    }
  };

  return (
    <>
      <div className="forgot_pwd_container flex-col min-h-screen items-center justify-center  bg-[283E46] w-screen font-display-main">
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px]">
            <form
              action="#"
              className="px-8 rounded-2xl"
              onSubmit={updatePassword}
              autoComplete="off"
            >
              <div className="text-center flex flex-col items-center">
                <div className="flex justify-center items-center flex-col">
                  {/* <div> */}
                  <img src={qlogo} className="w-[80px] mb-2 " />

                  <div>
                    {successMessage && (
                      <div className="flex items-center justify-center gap-2 p-2 text-green-700 rounded-md w-full transition-opacity duration-1000 ease-in-out opacity-100">
                        <img src={sucess} width={20} alt="Success" />

                        <p className="text-sm">{successMessage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className='text-center'>
                                {resetError && <p style={{ color: 'red' }}>{resetError}</p>}
                            </div> */}

              {/* <div> */}
              <div>
                <label
                  htmlFor="email"
                  className="block py-0.5 text-sm sm:text-base md:text-base lg:text-base"
                >
                  Email:
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  readOnly
                  value={decodeEmail}
                  // onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px]  cursor-no-drop pointer-events-none
                  text-sm sm:text-base md:text-base lg:text-base"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="pwd"
                  className="block py-0.5 mt-4 text-sm sm:text-base md:text-base lg:text-base"
                >
                  New Password:
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  maxLength={16}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  // onChange={(e) => setNewPassword(e.target.value)}
                  id="pwd"
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px] text-sm sm:text-base md:text-base lg:text-base"
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[24px] right-0 cursor-pointer"
                  src={visible ? pwdOpenIcon : pwdCloseIcon}
                  onClick={passwordVisible}
                  width="22"
                  alt="Toggle Password"
                />
                <div
                  className="flex items-center gap-2 h-[30px]  my-0.5"
                  style={{
                    visibility: validationText ? "visible" : "hidden",
                    minHeight: "16px",
                  }}
                >
                  <img src={error} className="w-[1em] h-[1em]" alt="Error" />

                  <p className=" text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm">
                    {validationText || "\u00A0"}
                  </p>
                </div>
              </div>

              <div className="relative">
                <label
                  htmlFor="cpwd"
                  className="block text-sm sm:text-base md:text-base lg:text-base"
                >
                  Confirm Password:
                </label>
                <input
                  type={pwdVisible ? "text" : "password"}
                  name="password"
                  maxLength={16}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="cpwd"
                  className="w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px] text-sm sm:text-base md:text-base lg:text-base"
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[24px] right-0 cursor-pointer"
                  src={pwdVisible ? pwdOpenIcon : pwdCloseIcon}
                  onClick={confirmPwdVisible}
                  width="22"
                  alt="Toggle Password"
                />
                <div
                  className={`flex items-center gap-2 h-[30px] py-1 mt-1 ${
                    passwordError || resetError
                      ? "text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm"
                      : "invisible"
                  }`}
                >
                  <img src={error} className="w-[1em] h-[1em]" alt="Error" />
                  <p className="text-xs md:text-lg lg:text-lg xl:text-sm">
                    {passwordError || resetError}
                  </p>
                </div>
              </div>

              <div>
                {/* {resetError && (
                  <div className="flex items-center gap-2 h-[30px] py-1 text-sm mt-1">
                    <img
                      src="/src/assets/images/error.svg"
                      width={18}
                      alt="Error"
                    />
                    <p style={{ color: "red" }}>{resetError}</p>
                  </div>
                )} */}

                <button
                  disabled={activeBtn}
                  onMouseOver={loginButtonAfterHover}
                  onMouseOut={loginButtonBeforeHover}
                  className={`flex items-center justify-center gap-0.5 pb-1.5 pt-1 mt-3  text-[1.3em] border border-[#283E46]   w-full  rounded-[25px] shadow-md transition duration-300
                  sm:text-[1.1em] md:text-[1.1em] lg:text-[1.1em] xl:text-[1.3em] ${
                    activeBtn
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-[#283E46] cursor-pointer hover:text-[#283E46] hover:bg-white text-[#ffc300]"
                  }`}
                >
                  Update Password
                  <img
                    src={login}
                    width={29}
                    height={29}
                    className="inline-block"
                    onMouseOver={(e) =>
                      (e.currentTarget.src =
                        "/src/assets/images/loginAfterHover.svg")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = "/src/assets/images/login.svg")
                    }
                  />
                </button>
                {/* </div> */}

                <div className="mt-4 flex items-center flex-col gap-0.5 text-xs sm:text-base md:text-base lg:text-base">
                  <p>
                    Remember your credentials!{" "}
                    <Link
                      to="/login"
                      className="underline text-[#283E46] font-semibold text-xs sm:text-base md:text-base lg:text-base"
                    >
                      Sign in{" "}
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
