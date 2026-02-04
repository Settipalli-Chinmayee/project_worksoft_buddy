import { useContext, useEffect, useRef, useState } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import Footer from "../../commonFolder/Footer/Footer";
import ReferralFooter from "../../commonFolder/ReferralFooter/ReferralFooter";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../UserContext/UserContext";
import { toast } from "react-toastify";
import "./page_otp.css";

const Page_otp = () => {
  const { isTheme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const referredUserEmail = authState?.user?.userEmail;
  // console.log(referredUserEmail)
  const location = useLocation();
  const { userEmail, userName, userRole } = location.state || {};
  const navigate = useNavigate();
  const [otpValues, setOtpValues] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [isTime, setTime] = useState(60);
  const [activeBtn, setActiveBtn] = useState(false);
  const [isError, setError] = useState("");

  useEffect(() => {
    for (let i = 0; i < otpValues.length; i++) {
      if (otpValues[i] === "") {
        inputsRef.current[i]?.focus();
        break;
      }
    }
  }, [otpValues]);
  useEffect(() => {
    const allowed = localStorage.getItem("allowOtp");
    // console.log(allowed)
    if (allowed !== "true") {
      navigate("/referralLogin");
    }
  }, [navigate]);

  const handleChange = (e, idx) => {
    const val = e.target.value;

    if (/^[a-zA-Z0-9]$/.test(val)) {
      const newOtpValues = [...otpValues];
      newOtpValues[idx] = val;
      setOtpValues(newOtpValues);

      if (idx < 5) {
        setTimeout(() => inputsRef.current[idx + 1]?.focus(), 0);
      }
    } else if (val === "") {
      const newOtpValues = [...otpValues];
      newOtpValues[idx] = "";
      setOtpValues(newOtpValues);
    }
  };

  const handleFocus = (idx) => {
    if (idx === 0) return;

    for (let i = 0; i < idx; i++) {
      if (otpValues[i] === "") {
        inputsRef.current[i]?.focus();
        return;
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && otpValues[idx] === "" && idx > 0) {
      // Move focus to previous input if current empty and backspace pressed
      inputsRef.current[idx - 1].focus();
    }
  };
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").slice(0, 6);
    if (/^[a-zA-Z0-9]{1,6}$/.test(pasteData)) {
      const newOtpValues = [...otpValues];
      for (let i = 0; i < pasteData.length; i++) {
        newOtpValues[i] = pasteData[i];
      }
      setOtpValues(newOtpValues);
      if (pasteData.length < 6) {
        inputsRef.current[pasteData.length]?.focus();
      } else {
        inputsRef.current[5]?.focus();
      }
    }
  };

  const getOtp = async (e) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (otp.length < 6) {
      alert("Please enter all 6 characters of the OTP.");
      return;
    }

    const data = { otp, email: referredUserEmail };
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.ok) {
        navigate("/home");
        localStorage.setItem("allowOtp", "false");
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // expires in 7 days
        const userDetails = {
          userEmail,
          userName,
          userRole,
          expiryDate: expiryDate.toISOString(),
        };
        localStorage.setItem("userName", userName);
        console.log(userDetails);
        Cookies.set("cookiesAccepted", "true", { expires: expiryDate });
        Cookies.set("cookieExpiryDate", expiryDate.toISOString(), {
          expires: expiryDate,
        });
        Cookies.set("Authentication", result.Authentication, {
          expires: expiryDate,
        });
        Cookies.set("userDetails", JSON.stringify(userDetails), {
          expires: 1,
        });
      } else {
        console.log(result.message);
        setError(result.message);
      }
    } catch (error) {
      console.log(error.name, ":", error.message);
    }
  };

  const resendOtp = async (e) => {
    console.log("resend otp");
    if (isTime > 0) {
      return;
    }
    if (e.isTrusted) {
      setActiveBtn(true);
      setTimeout(async () => {
        const data = { email: referredUserEmail };
        try {
          const response = await fetch(
            "http://localhost:3000/api/v1/referral/resendOtp",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();
          if (response.ok && result.success) {
            toast.success("OTP has been resent Successfully");
            setError("OTP hase been resent to user email");
            setTime(60);
          } else {
            console.log(result.message || "Failed to resend OTP");
          }
        } catch (error) {
          console.log(error.name, ":", error.message);
        } finally {
          setActiveBtn(false);
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (isTime <= 0) {
      return;
    }
    const intervalId = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isTime]);

  return (
    <>
      <div
        className={`forgot_pwd_container flex flex-col min-h-screen items-center justify-between w-screen font-display-main ${
          isTheme ? "bg-[#121212] text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-[400px] ">
            {/* <div>OPT PAGE</div> */}
            <div>
              <div className="text-center flex flex-col items-center">
                <img
                  src="./src/assets/images/qlogo.svg"
                  className="w-[80px] mb-2"
                  alt="Logo"
                />
              </div>
              <p
                className="text-center font-semibold text-2xl mb-[10px]"
                style={{ color: isTheme ? "white" : "#283E46" }}
              >
                OTP Verification
              </p>
              <p className="text-center text-green-600 text-xs">
                *One Time Password (OTP) has been sent via useremail{" "}
                <strong>{referredUserEmail}</strong>.
              </p>
              <form
                action=""
                onSubmit={getOtp}
                className="formVerifyOtp"
              >
                <p
                  className="text-center mb-[10px] text-gray-600"
                  style={{ color: isTheme ? "white" : "#283E46" }}
                >
                  Enter the OTP below to verify it.
                </p>
                <div className="flex gap-[1.4em]">
                  {otpValues.map((val, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={val}
                      onChange={(e) => handleChange(e, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      onPaste={handlePaste}
                      ref={(el) => (inputsRef.current[idx] = el)}
                      onFocus={() => handleFocus(idx)}
                      className="w-12 h-12 text-center border border-gray-400 rounded"
                      autoComplete="off"
                      inputMode="text"
                      pattern="[a-zA-Z0-9]"
                    />
                  ))}
                </div>
                <p
                  className="mt-[10px] text-center text-xs"
                  style={{ color: isTheme ? "lightgray" : "#283E46" }}
                >
                  OTP expires in {isTime} seconds!
                </p>
                <div className="hiringError">
                  {isError && (
                    <>
                      <img
                        src="./src/assets/images/error.svg"
                        // className="error-icon"
                        width={16}
                        alt="Error"
                      />
                      <p
                        role="alert"
                        style={{
                          color: "red",
                          textAlign: "center",
                          fontSize: "14px",
                        }}
                      >
                        {isError}
                      </p>
                    </>
                  )}
                </div>
                <div className="verifyResendOtpSection">
                  <div style={{width: "100%",marginTop:"1em"}}>
                    <button
                      type="submit"
                      disabled={
                        otpValues.some((val) => val === "") || activeBtn
                      }
                      className={`verifyOtpBtn ${
                        otpValues.some((val) => val === "") || activeBtn
                          ? "disabledBtn"
                          : "enabledBtn"
                      }`}
                    >
                      Verify OTP
                    </button>
                  </div>

                  <div className="resendOtpContainer">
                    <button
                      onClick={resendOtp}
                      disabled={isTime > 0 || activeBtn}
                      className={`resendOtpBtn ${
                        isTime > 0 ? "disabledResend" : "enabledResend"
                      }`}
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              </form>
              {/* <button onClick={() => resendOtp()}>Resend OTP</button> */}
              {/* <div style={{ textAlign: "end", fontSize: "16px" }}>
                <button
                  onClick={resendOtp}
                  disabled={isTime > 0 || activeBtn}
                  className={` px-4 py-2 rounded ${
                    isTime > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#ffc300] cursor-pointer"
                  }`}
                >
                  Resend OTP
                </button>
              </div> */}

              {/* <p>Resend OTP</p> */}
            </div>
          </div>
        </div>
        <div className="w-full">
          <ReferralFooter />
        </div>
      </div>
    </>
  );
};

export default Page_otp;
