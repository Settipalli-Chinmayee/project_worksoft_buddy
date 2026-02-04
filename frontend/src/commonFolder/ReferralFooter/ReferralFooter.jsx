import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../components/ThemeContext/ThemeContext";

const ReferralFooter = () => {
  const [isPopup, setIsPopup] = useState(false);
  const [isPopupTwo, setIsPopupTwo] = useState(false);

  const { isTheme } = useContext(ThemeContext);

  return (
    <>
      {/* <div className="flex justify-center   item-center bg-[#e5e5e5] py-2"> */}
      <div
        className={`flex flex-wrap justify-between items-center  px-6 py-2 ${
          isTheme ? "bg-[#383737]" : "bg-[#e5e5e5]"
        }`}
      >
        {/* Left side */}
        {/* <p className={` text-[0.6em] sm:text-[0.7em] lg:text-[0.8em] ${isTheme ? 'text-gray-400' : 'text-gray-700'}`}>Copyright 2025 Qualesce</p> */}
        <p
          className={`${
            isTheme ? "text-gray-400" : "text-gray-700"
          } text-[0.6em] sm:text-[0.7em] md:text-[0.6em] lg:text-[0.6em] xl:text-[0.8em] cursor-pointer`}
        >
          {" "}
          Copyright <span>&#169;</span> 2025 Qualesce
        </p>

        {/* Center */}
        <a
          href="https://qualesce.com/"
          target="_blank"
          className="flex justify-center items-center"
        >
          <img
            src={
              isTheme
                ? "./src/assets/images/poweredBy_dark.svg"
                : "./src/assets/images/poweredby_center.svg"
            }
            alt="Powered by Qualesce"
            className="w-auto h-auto relative top-[6px] sm:static sm:top-auto"
          />
        </a>

        {/* Right side */}
        <div className="flex">
          <p
            onClick={() => setIsPopup(true)}
            className={`text-[0.6em] sm:text-[0.7em] md:text-[0.6em] lg:text-[0.6em] xl:text-[0.8em] cursor-pointer ${
              isTheme ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Terms Policies |
          </p>
          <p
            onClick={() => setIsPopupTwo(true)}
            className={`text-[0.6em] sm:text-[0.7em] md:text-[0.6em] mx-0.5 lg:text-[0.6em] xl:text-[0.8em] cursor-pointer ${
              isTheme ? "text-gray-400" : "text-gray-700"
            }`}
          >
            Privacy Policies
          </p>
        </div>
        {isPopup && (
          <>
            <div
              className={`fixed  inset-0 opacity-50 z-40 ${
                isTheme ? "bg-black" : "bg-gray-50"
              }`}
            ></div>
            {/* <div className="fixed flex items-center justify-center"> */}
            <div
              className={`fixed top-[35%] left-[5%] sm:top-[305] sm:left-[80px] md:top-[40%] md:left-[150px] lg:top-[35%] lg:left-[35%]
               p-4  z-50 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-[15px]  text-[12px] sm:text-[13px] md:text-[14px] 
               ${
                 isTheme
                   ? "text-gray-400 bg-black border border-[#ffc300]"
                   : "text-gray-700 border border-[#80808030] bg-white shadow-[0px_2px_8px_0px_#e5e5e5]"
               }
              `}
            >
              {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"> */}
              <div className="flex justify-between">
                <h2
                  className={`text-xs lg:text-lg font-semibold mb-4 text-gray-800 ${
                    isTheme ? "text-white" : "text-gray-700"
                  }`}
                >
                  Terms Policies
                </h2>
                <img
                  src={
                    isTheme
                      ? "./src/assets/images/cross-svgrepo-dark-com.svg"
                      : "./src/assets/images/cross-svgrepo-com.svg"
                  }
                  onClick={() => setIsPopup(false)}
                  className="relative bottom-2 cursor-pointer  w-[10px] lg:w-[14px]"
                  alt=""
                />
              </div>
              <p
                className={`text-[0.6em] sm:tex-[0.8em] md:text-[0.8em] lg:text-sm ${
                  isTheme ? "text-[#E5E6E4]" : "text-[#6f6e6e]"
                }`}
              >
                This website is not fully accessible to individuals with
                physical disabilities.
              </p>
              <div className="flex justify-end mt-4"></div>
            </div>
          </>
        )}
        {isPopupTwo && (
          <>
            <div
              className={`fixed  inset-0 opacity-50 z-40 ${
                isTheme ? "bg-black" : "bg-gray-50"
              }`}
            ></div>

            {/* <div className="fixed flex items-center justify-center"> */}
            <div
              className={` cursor-pointer fixed top-[35%] left-[5%] sm:top-[305] sm:left-[80px] md:top-[40%] md:left-[150px] lg:top-[35%] lg:left-[35%]
             p-4  z-50 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[30%] rounded-[15px]   text-[12px] sm:text-[13px] md:text-[14px]
              ${
                isTheme
                  ? "text-gray-400 bg-black border border-[#ffc300]"
                  : "text-gray-700 border border-[#80808030] bg-white shadow-[0px_2px_8px_0px_#e5e5e5]"
              }
             
             `}
            >
              {/* <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full"> */}
              <div className="flex justify-between">
                <h2
                  className={`text-xs lg:text-lg font-semibold mb-4 text-gray-800 ${
                    isTheme ? "text-white" : "text-gray-700"
                  }`}
                >
                  Privacy Policies
                </h2>
                <img
                  src={
                    isTheme
                      ? "./src/assets/images/cross-svgrepo-dark-com.svg"
                      : "./src/assets/images/cross-svgrepo-com.svg"
                  }
                  onClick={() => setIsPopupTwo(false)}
                  className="relative bottom-2 cursor-pointer w-[10px] lg:w-[14px]"
                  alt=""
                />
              </div>
              <p
                className={`text-[0.6em] sm:tex-[0.8em] md:text-[0.8em] lg:text-sm ${
                  isTheme ? "text-[#E5E6E4]" : "text-[#6f6e6e]"
                }`}
              >
                This website is not fully accessible to individuals with
                physical disabilities.
              </p>
              <div className="flex justify-end mt-4"></div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ReferralFooter;
