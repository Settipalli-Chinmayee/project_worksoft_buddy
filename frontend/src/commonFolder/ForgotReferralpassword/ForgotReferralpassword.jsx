import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Footer from "../../commonFolder/Footer/Footer";
import ReferralFooter from "../ReferralFooter/ReferralFooter";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const ForgotReferralpassword = () => {
  document.title = "HR BOT | Forgot Password";

  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const allowedDomainEmail = (email) => {
    const allowedDomain = "qualesce.com";
    const domainSplit = email.split("@")[1]?.toLowerCase();
    return domainSplit === allowedDomain;
  };

  const { isTheme } = useContext(ThemeContext);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const sendMail = async (e) => {
    e.preventDefault();

    // if (!validateEmail(email)) {
    //   setErrorMessage("Please enter a valid email address.");
    //   return;
    // }

    const data = { email };
    try {
      const response = await fetch(
        "https://worksoftbuddyapi.qualesce.com/api/v1/users/forgotPassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuccessMessage(result.message);
        setTimeout(() => navigate("/login"), 2500); // Smooth transition after success
      } else {
        const result = await response.json();
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
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
        className={`forgot_pwd_container flex flex-col min-h-screen items-center justify-between w-screen  ${
          isTheme ? "bg-[#121212] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px]">
            <form
              onSubmit={sendMail}
              className="px-8 rounded-2xl"
              autoComplete="off"
            >
              <div className="text-center flex flex-col items-center">
                <img
                  src="./src/assets/images/qlogo.svg"
                  className="w-[80px]"
                  alt="Logo"
                />
                {successMessage && (
                  <div className="flex items-center justify-center gap-2 p-2 text-green-700 rounded-md w-full transition-opacity duration-1000 ease-in-out opacity-100">
                    <img
                      src="./src/assets/images/success.svg"
                      width={20}
                      alt="Success"
                    />
                    <p className="text-sm">{successMessage}</p>
                  </div>
                )}
              </div>

              {/* <div className="text-center bg-[#d4d8da] rounded-[10px] my-5">
                <h1 className="p-1 text-[#283e46] text-[0.9em]">
                  Enter your registered email ID to receive a password reset
                  link
                </h1>
              </div> */}

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
                    if (e.target.value) setErrorMessage("");
                  }}
                  onFocus={() => setErrorMessage("")}
                  className={`w-full pr-0.5 py-1 outline-none border-b-1 ${
                    isTheme ? "border-[white]" : "border-[#283E46]"
                  }`}
                />

                {/* Error Message (Inline Validation + Backend Error) */}
                {/* <div className="flex items-center gap-1.5 h-[30px] text-red-600 py-1  mt-1 text-xs md:text-lg lg:text-lg xl:text-sm">
                  {email && !validateEmail(email) && !errorMessage && (
                    <>
                      <img
                        src="./src/assets/images/error.svg"
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p className="text-xs md:text-lg lg:text-lg xl:text-sm">
                        Please enter a valid email address.
                      </p>
                    </>
                  )}

                  {errorMessage && (
                    <>
                      <img
                        src="./src/assets/images/error.svg"
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p className="text-[0.79em]">{errorMessage}</p>
                    </>
                  )}
                </div> */}

                <div className="flex flex-col gap-1 h-[30px] text-red-600 py-1 mt-1">
                  {errorMessage ? (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm whitespace-nowrap">
                      <img
                        src="./src/assets/images/error.svg"
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p>{errorMessage}</p>
                    </div>
                  ) : email && !allowedDomainEmail(email) ? (
                    <div className="flex items-center gap-1.5 text-red-600 text-xs md:text-lg lg:text-lg xl:text-sm whitespace-nowrap">
                      <img
                        src="./src/assets/images/error.svg"
                        className="w-[1em] h-[1em]"
                        alt="Error"
                      />
                      <p>Only users with a qualesce.com email can register!</p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Success Message */}

              {/* Submit Button */}
              <button
                onMouseOver={loginButtonAfterHover}
                onMouseOut={loginButtonBeforeHover}
                className="flex items-center justify-center gap-0.5 pb-1.5 pt-1 mt-1 bg-[#283E46] text-[1.3em] border border-[#283E46] cursor-pointer text-[#ffc300] w-full hover:text-[#283E46] hover:bg-white rounded-[25px] shadow-md transition duration-300
              sm:text-[1.1em] md:text-[1.1em] lg:text-[1.1em] xl:text-[1.3em"
              >
                Send Mail
                <img
                  onMouseOver={loginButtonAfterHover}
                  onMouseOut={loginButtonBeforeHover}
                  src="./src/assets/images/login.svg"
                  width={29}
                  height={29}
                  className="inline-block"
                  alt="Send Mail"
                />
              </button>

              {/* Back to Login */}
              <div className="mt-4 flex items-center flex-col gap-0.5 text-xs sm:text-base md:text-base lg:text-base">
                <p>
                  Remember your credentials?{" "}
                  <Link
                    to="/referralLogin"
                    className={`underline text-[#283E46] font-semibold text-xs sm:text-base md:text-base lg:text-base ${
                      isTheme ? "text-[#ffc300]" : "text-[#283E46]"
                    }`}
                  >
                    Sign in{" "}
                  </Link>
                </p>
              </div>
              <div className="rounded-[10px] text-center my-1 ">
                <h1 className="p-1  text-gray-400 text-[0.6em] sm-text-[0.65em] lg:text-[0.7em] xl:text-[0.75em]">
                  <sup className="text-red-700 px-1">*</sup>
                  Enter your registered email ID to receive a password reset
                  link!
                </h1>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full">
          <ReferralFooter />
        </div>
      </div>
    </>
  );
};

export default ForgotReferralpassword;
