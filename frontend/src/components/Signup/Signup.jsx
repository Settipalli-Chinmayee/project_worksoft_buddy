import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";

// import Footer from "../../commonFolder/Footer/Footer";
import loginAfterHover from "../../assets/images/loginAfterHover.svg";
import login from "../../assets/images/login.svg";
import qlogo from "../../assets/images/qlogo.svg";
import error from "../../assets/images/error.svg";
import pwdOpenIcon from "../../assets/images/pwdOpenIcon.svg";
import pwdCloseIcon from "../../assets/images/pwdCloseIcon.svg";
import pwdOpenDark from "../../assets/images/pwdOpenDark.svg";
import pwdCloseDark from "../../assets/images/pwdCloseDark.svg";
import sucess from "../../assets/images/success.svg";
import Footer from "../../commonFolder/Footer/Footer";

const Signup = () => {
  document.title = "Worksoft Buddy | Signup";

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false); // for new password
  const [pwdVisible, setPwdVisible] = useState(false); // for confirm password
  const [validationText, setValidationText] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const allowedDomainEmail = (email) => {
    const allowedDomain = "qualesce.com";
    const domainSplit = email.split("@")[1]?.toLowerCase();
    return domainSplit === allowedDomain;
  };

  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    const localTheme = localStorage.getItem("theme");

    if (localTheme === "dark") {
      setIsDark(true);
    } else if (localTheme === "light") {
      setIsDark(false);
    } else {
      // If no local theme is set, use system preference
      const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");

      const handleThemeChange = (e) => {
        setIsDark(e.matches);
      };

      // Initial check
      setIsDark(darkTheme.matches);

      // Listen for system theme changes
      darkTheme.addEventListener("change", handleThemeChange);

      // Cleanup on unmount
      return () => darkTheme.removeEventListener("change", handleThemeChange);
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

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

  const getUser = async (e) => {
    e.preventDefault();
    if (!userName || !email || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don’t match");
      return;
    }

    // Validate new password
    const validationMessage = validatePassword(newPassword);
    // console.log()
    if (validationMessage) {
      setValidationText(validationMessage);
      return;
    }

    // if (!validateEmail(email)) {
    //   setEmailError("Please enter a valid Email");
    //   setFormValid(false);
    //   return;
    // }

    // const validationMessage = validatePassword(newPassword);
    // setValitationText(validationMessage);
    // console.log(validationMessage);

    // if (validationMessage) {
    //   setFormValid(false);
    //   return;
    // }
    // setFormValid(true);
    const data = { userName, email, newPassword };
    console.log(data.newPassword);
    try {
      const response = await fetch(
        "https://blogbuddyv1api.qualesce.com/api/v1/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);
      console.log(data);
      const result = await response.json();
      if (response.ok) {
        navigate("/");
        console.log(result);
      } else {
        // let resMessage = await response.json();

        console.log("Error: ", response.status);
        if (result && result.message) {
          let messageError = result.message;
          setErrorMessage(messageError);
          console.log(result.message);
          // setEmailError(result.message);
        }
      }
    } catch (err) {
      console.log("Request failed: ", err);
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
    console.log(e);
    setNewPassword(e.target.value);
    setErrorMessage("");
    const validationMessage = validatePassword(e.target.value);
    setValidationText(validationMessage);
  };

  // useEffect(() => {
  //   const validationMessage = validatePassword(newPassword);
  //   setValidationText(validationMessage);

  //   // If there's a validation error, set form as invalid
  //   setFormValid(!validationMessage);
  // }, [newPassword]); //
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
      {/* <div className="flex flex-col min-h-screen items-center justify-center  bg-[283E46] w-screen  font-display-main"> */}
      <div
        className={`signUp_Container flex flex-col min-h-screen items-center justify-between w-screen  ${
          isDark ? "bg-[#121212] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px]">
            <form
              action="#"
              className="px-8 rounded-2xl"
              onSubmit={getUser}
              autoComplete="off"
            >
              <div className="text-center flex flex-col items-center">
                <div>
                  <img src={qlogo} className="w-[80px] mb-2 " />

                  {/* Success Message */}
                  {successMessage && (
                    <div
                      className={`flex items-center justify-center gap-2 p-2 text-green-700 rounded-md w-full 
    transition-opacity duration-1000 ease-in-out opacity-100`}
                    >
                      <img src={sucess} width={20} alt="Success" />

                      <p className="text-sm">{successMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block py-0.5 text-sm sm:text-base md:text-base lg:text-base"
                >
                  Full Name:{" "}
                </label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  value={userName}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1  h-[25px] text-sm sm:text-base md:text-base lg:text-base ${
                    isDark ? "border-[white]" : "border-[#283E46]"
                  }`}
                  onChange={(e) => {
                    setUserName(e.target.value);
                    if (e.target.value) {
                      setErrorMessage("");
                    }
                  }}
                  // onChange={(e) => setUserName(e.target.value)}
                />
                <div className="h-[20px]"></div>
              </div>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) {
                      setErrorMessage("");
                    }
                  }}
                  value={email}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1 h-[25px] text-sm sm:text-base md:text-base lg:text-base ${
                    isDark ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                <div>
                  {/* First condition: Domain check */}
                  <div
                    className="flex items-center gap-1.5 h-[20px] text-red-600 mt-1"
                    // className="flex items-center gap-1.5 h-[20px] text-red-600  mt-1 text-xs md:text-lg lg:text-lg xl:text-sm"
                    style={{
                      visibility:
                        email && !allowedDomainEmail(email)
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    <img src={error} className="w-[1em] h-[1em]" alt="Error" />

                    <p
                      // className="text-red-600  text-xs md:text-lg lg:text-lg xl:text-sm"
                      className="text-red-600 text-xs md:text-xs lg:text-[0.79em] xl:text-[0.79em]"
                    >
                      Only users with a qualesce.com email can register!
                    </p>
                  </div>
                </div>
                {/* <div
                  className="flex items-center gap-1.5 h-[20px] text-red-600  mt-1 text-xs md:text-lg lg:text-lg xl:text-sm"
                  style={{
                    visibility:
                      email && !validateEmail(email) ? "visible" : "hidden",
                  }}
                >
                  <img
                    src="./src/assets/images/error.svg"
                    className="w-[1em] h-[1em]"
                    alt="Error"
                  />
                  <p className="text-red-600  text-xs md:text-lg lg:text-lg xl:text-sm">
                    Please enter a valid email address.
                  </p>
                  {emailError && (
                    <p className="text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm mt-1"> {emailError} </p>
                  )}
                </div> */}
              </div>
              <div className="relative">
                <label
                  htmlFor="pwd"
                  className="block py-0.5 text-sm sm:text-base md:text-base lg:text-base"
                >
                  New Password:
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  value={newPassword}
                  maxLength={16}
                  onChange={handlePasswordChange}
                  id="pwd"
                  className={`w-full  py-1 outline-none border-b-1 h-[25px] pr-10 text-sm sm:text-base md:text-base lg:text-base ${
                    isDark ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[24px] right-0 cursor-pointer"
                  src={
                    visible
                      ? isDark
                        ? pwdOpenDark
                        : pwdOpenIcon
                      : isDark
                      ? pwdCloseDark
                      : pwdCloseIcon
                  }
                  onClick={passwordVisible}
                  width="20"
                  alt="Toggle Password"
                />
                <div
                  className="flex items-center gap-1.5 h-[30px] text-red-600 py-1 mt-1 text-xs md:text-lg lg:text-lg xl:text-sm"
                  style={{
                    visibility: validationText ? "visible" : "hidden",
                  }}
                >
                  <img src={error} className="w-[1em] h-[1em]" alt="Error" />
                  <p className="text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm">
                    {validationText || "\u00A0"}
                  </p>{" "}
                </div>
              </div>
              <div className="relative">
                <label
                  htmlFor="pwd"
                  className="block text-sm sm:text-base md:text-base lg:text-base"
                >
                  Confirm Password:
                </label>
                <input
                  type={pwdVisible ? "text" : "password"}
                  name="password"
                  value={confirmPassword}
                  maxLength={16}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value) {
                      setErrorMessage("");
                    }
                  }}
                  id="pwd"
                  className={`w-full py-1 outline-none border-b-1  h-[25px] pr-10 text-sm sm:text-base md:text-base lg:text-base ${
                    isDark ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[24px] right-0 cursor-pointer"
                  src={
                    pwdVisible
                      ? isDark
                        ? pwdOpenDark
                        : pwdOpenIcon
                      : isDark
                      ? pwdCloseDark
                      : pwdCloseIcon
                  }
                  onClick={confirmPwdVisible}
                  width="20"
                  alt="Toggle Password"
                />
                <div
                  className={`flex items-center gap-1.5 h-[30px] py-1 mt-1 ${
                    passwordError || errorMessage
                      ? "text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm"
                      : "invisible"
                  }`}
                >
                  {passwordError || errorMessage ? (
                    <>
                      <img
                        src={error}
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p className="text-xs md:text-lg lg:text-[0.85em] xl:text-[0.85em]">
                        {passwordError || errorMessage}
                      </p>
                    </>
                  ) : null}
                </div>

                {/* <div> */}
                <button
                  onMouseOver={loginButtonAfterHover}
                  onMouseOut={loginButtonBeforeHover}
                  className="flex items-center justify-center gap-0.5 pb-1.5 pt-1  bg-[#283E46] text-[1em] sm:text-[1.1em] md:text-[1.1em] lg:text-[1.1em] xl:text-[1.3em] border border-[#283E46] cursor-pointer text-[#ffc300] w-full hover:text-[#283E46] hover:bg-white rounded-[25px] shadow-md transition duration-30"
                >
                  Sign up
                  <img
                    src={login}
                    width={29}
                    height={29}
                    className="inline-block"
                    onMouseOver={(e) =>
                      (e.currentTarget.src =
                        "./src/assets/images/loginAfterHover.svg")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.src = "./src/assets/images/login.svg")
                    }
                  />
                </button>
                {/* </div> */}
                <div className="mt-4 flex items-center flex-col gap-0.5 text-xs sm:text-base md:text-base lg:text-base">
                  <p>
                    Already have an account?{" "}
                    <Link
                      to="/"
                      className={`underline text-[#283E46] font-semibold text-xs sm:text-base md:text-base lg:text-base ${
                        isDark ? "text-[#ffc300]" : "text-[#283E46]"
                      }`}
                    >
                      Sign in{" "}
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Footer at the bottom */}
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Signup;
