import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../UserContext/UserContext";
// import CookiesPopup from "../CookiesPopup/CookiesPopup";
import Cookies from "js-cookie";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import ReferralFooter from "../../commonFolder/ReferralFooter/ReferralFooter";
import { toast } from "react-toastify";

const Referral_Login = () => {
  document.title = "HR Referral Portal | Login";
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [activeBtn, setActiveBtn] = useState(false);
  const allowedDomainEmail = (email) => {
    const allowedDomain = "qualesce.com";
    const domainSplit = email.split("@")[1]?.toLowerCase().trim();
    return domainSplit === allowedDomain;
  };

  const { isTheme } = useContext(ThemeContext);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // console.log(emailRegex)
    return emailRegex.test(email);
  };

  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const getUser = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setFadeOut(false);
    if (e.isTrusted) {
      // console.log("User clicked the login button.");
      setActiveBtn(true);
      setTimeout(async () => {
        const data = { email, password };
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
          console.log("login", response);
          if (response.ok) {
            const result = await response.json();
            console.log("result", result);
            toast.success("OTP has been sent to user email.")
            if (result) {
              const {
                userEmail,
                userName,
                Authentication,
                userRole,
                userId,
                userDepartment,
                status,
              } = result;
              // / Save authentication state to context
              // console.log(result.userDepartment);
              localStorage.setItem("allowOtp", "true");
              navigate("/otp", {
                replace: true,
                state: {
                  userEmail: result.userEmail,
                  userName: result.userName,
                  userRole: result.role,
                  Authentication: result.Authentication,
                  userId: result.userId,
                  userDepartment: result.userDepartment,
                  status: result.status,
                },
              });

              // console.log(result,"user result")
              // console.log(status,"user status")

              login({
                userEmail: userEmail,
                userName: userName,
                userRole: userRole,
                Authentication: Authentication,
                userId: userId,
                userDepartment: userDepartment,
                status: status,
              });
              // const expiryDate = new Date();
              // expiryDate.setDate(expiryDate.getDate() + 7); // expires in 7 days
              // const userDetails = {
              //   userEmail,
              //   userName,
              //   userRole,
              //   expiryDate: expiryDate.toISOString(),
              // };

              // localStorage.setItem("userName", userName);
              // console.log(userDetails);
              // Cookies.set("cookiesAccepted", "true", { expires: expiryDate });
              // Cookies.set("cookieExpiryDate", expiryDate.toISOString(), {
              //   expires: expiryDate,
              // });
              
              // Cookies.set("userEmail", result.userEmail, { expires: expiryDate });
              // Cookies.set("userName", result.userName, { expires: expiryDate });

              // Cookies.set("Authentication", result.Authentication, {
              //   expires: expiryDate,
              // });
              // Cookies.set("userDetails", JSON.stringify(userDetails), {
              //   expires: 1,
              // });
              console.log("Cookies have been set");

              if (result.Authentication) {
                localStorage.removeItem("cookiesAccepted");
              }
            }
            // console.log(result);
            setPasswordError(result.message);
          } else {
            const result = await response.json();
            const resMessage = result.message;
            setErrorMessage(resMessage);
            // console.log("Error: ", response.status);
          }
        } catch (err) {
          console.log("Request failed: ", err);
        } finally {
          setActiveBtn(false)
        }
      }, 2000);
    }
  };

  useEffect(() => {
    setHasAcceptedCookies(false); // Always show popup
  }, []);

  const passwordVisible = () => {
    setVisible((prev) => !prev);
  };
  const loginButtonAfterHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "./src/assets/images/loginAfterHover.svg";
    }
  };
  const loginButtonBeforeHover = (e) => {
    const img = e.target.querySelector("img");
    if (img) {
      img.src = "./src/assets/images/login.svg";
    }
  };


  return (
    <>
      <div
        className={`login_container flex flex-col min-h-screen items-center justify-between w-screen ${
          isTheme ? "bg-[#121212] text-white" : "bg-white text-black"
        }`}
      >
        <div className="fixed top-0 right-0 flex mt-4 mr-4 space-x-4">
          <Link
            to="/"
            className="flex flex-row items-center w-[110px] py-1 px-3 gap-0.5 justify-center  font-[500] rounded-[25px] bg-[#f1f1f1] text-[#283e46] border-[1.5px] border-amber-400"
          >
            <img
              src="./src/assets/images/home.svg"
              alt="Home"
              width={20}
              height={20}
              className="mb-1"
            />
            <span className="text-sm">Home</span>
          </Link>

          <Link
            to="/hrbot"
            className="flex flex-row items-center w-[110px]  py-1 px-3 gap-1 justify-center  font-[500]  rounded-[25px] bg-[#f1f1f1] text-[#283e46] border-[1.5px] border-amber-400"
          >
            <img
              src="./src/assets/images/botButton.svg"
              alt="Referrals"
              width={20}
              height={20}
              // className="mb-1"
            />
            <span className="text-sm">HR Bot</span>
          </Link>
        </div>
        {/* <div className="fixed top-0 right-0 mr-4 mt-4 text-right ">
          <Link to="/" className="rounded-[5px] bg-[#f1f1f1] p-2 mr-[10px]">
            Home
          </Link>
          <Link to="/hrbot" className="rounded-[5px] bg-[#f1f1f1] p-2">
            HR Bot
          </Link>
        </div> */}
        {/* Wrapper to center form */}
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px] ">
            <form
              onSubmit={getUser}
              className="px-8 rounded-2xl"
              autoComplete="off"
            >
              <div className="text-center flex flex-col items-center">
                <img
                  src="./src/assets/images/qlogo.svg"
                  className="w-[80px] mb-2"
                  alt="Logo"
                />
              </div>
              <div className="text-base text-center font-semibold md:text-xl lg:text-2xl">
                <p>Refferal Portal</p>
              </div>

              {/* Email Input */}
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value && password) setErrorMessage(""); // Clear error if both fields are filled
                  }}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px] text-sm sm:text-base md:text-base lg:text-base ${
                    isTheme ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                <div>
                  {/* First condition: Domain check */}
                  <div
                    className="flex items-center gap-1.5 h-[20px] text-red-600  mt-1 "
                    style={{
                      visibility:
                        email && !allowedDomainEmail(email)
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    <img
                      src="./src/assets/images/error.svg"
                      className="w-[1em] h-[1em]"
                      alt="Error"
                    />
                    <p className="text-red-600  text-xs md:text-lg lg:text-[0.79em] xl:text-[0.79em]">
                      Only users with a qualesce.com email can login!
                    </p>
                  </div>
                </div>
              </div>

              {/* Password Input with Toggle */}
              <div className="relative">
                <label
                  htmlFor="pwd"
                  className="block py-0.5 text-sm sm:text-base md:text-base lg:text-base"
                >
                  Password:
                  {/* Password<sup className="text-[#d90429] text-[0.7em] pl-1">*</sup> */}
                </label>
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  id="pwd"
                  maxLength={16}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (email && e.target.value) setErrorMessage("");
                  }}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1 border-[#283E46] h-[25px] text-sm sm:text-base md:text-base lg:text-base ${
                    isTheme ? "border-[white]" : "border-[#283E46]"
                  }`}
                />
                {/* Password Visibility Icon */}
                <img
                  className="absolute top-[27px] right-0 cursor-pointer"
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
                  width="22"
                  alt="Toggle Password"
                />
              </div>

              {/* Display Error Message */}
              <div className="mt-3 h-[10px] flex items-center">
                {/* {successMessage && (
                  <div
                    className={`flex items-center gap-2 p-2  text-green-700 rounded-md w-full 
                    transition-opacity duration-1000 ease-in-out ${
                      successMessage ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <img
                      src="./src/assets/images/success.svg"
                      width={20}
                      alt="Success"
                    />
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}{" "} */}
                {errorMessage && (
                  <div className="flex items-center gap-2  rounded-md w-full">
                    <img
                      src="./src/assets/images/error.svg"
                      width={20}
                      alt="Error"
                    />
                    <p className="text-[#d90429] text-sm lg:text-[0.79em]">
                      {errorMessage}
                    </p>
                  </div>
                )}
              </div>

              {/* Login Button */}
              <div>
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
                  Login
                  <img
                    src="./src/assets/images/login.svg"
                    width={29}
                    height={29}
                    className="inline-block"
                    alt="Login Icon"
                  />
                </button>

                {/* Forgot Password & Sign Up Links */}
                <div className="mt-4 flex items-center flex-col gap-0.5">
                  <Link
                    to="/forgotReferralPassword"
                    className={`underline text-[#283E46] font-semibold text-xs sm:text-base md:text-base lg:text-base ${
                      isTheme ? "text-[#ffc300]" : "text-[#283E46]"
                    }`}
                  >
                    Forgot Password?
                  </Link>
                  <p className="mt-1">
                    Don't have an account?{" "}
                    <Link
                      to="/referralSignup"
                      className={`underline text-[#283E46] font-semibold text-xs sm:text-base md:text-base lg:text-base ${
                        isTheme ? "text-[#ffc300]" : "text-[#283E46]"
                      }`}
                    >
                      Sign up!
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* {!hasAcceptedCookies && <CookiesPopup isAuthenticated={isAuthenticated} setHasAcceptedCookies={setHasAcceptedCookies}  />} */}
        {/* <CookiesPopup setHasAcceptedCookies={setHasAcceptedCookies} /> */}
        {/* Footer at the bottom */}
        <div className="w-full">
          <ReferralFooter />
        </div>
      </div>
    </>
  );
};

export default Referral_Login;
