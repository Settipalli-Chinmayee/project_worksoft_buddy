import React from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import ChatHistory from "../ChatHistory/ChatHistory";
import UserProfile from "../UserProfile/UserProfile";
// const isDark = localStorage.getItem("theme") === "dark";
import close_dark from "../../assets/images/cross-svgrepo-dark-com.svg";
import close_icon from "../../assets/images/cross-svgrepo-com.svg";
import qlogo from "../../assets/images/qlogo.svg";
import chatHistory_icon from "../../assets/images/chatHistory.svg";
import chatHistory_light from "../../assets/images/chatHistory_light.svg";

const SideBar = ({
  userName,
  setAuthenticated,
  chatHistory,
  onSelect,
  isDark,
  activeIndex,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  // console.log("sidebar index",activeIndex);
  console.log(
    "sidebarIndex",
    typeof activeIndex === "number" ? activeIndex : "null"
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://worksoftbuddyapi.qualesce.com/api/v1/users/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        const result = await response.json();
        if (result) {
          navigate("/");
        }
        console.log(result);
      } else {
        console.log("Error: ", response.status);
      }
    } catch (err) {
      console.log("Request failed: ", err);
    }
    // try {
    //   const response = await fetch("http://localhost:3000/api/v1/users/logout", {
    //     method: "GET",
    //     credentials: "include",
    //   });

    //   if (response.ok) {
    //     setAuthenticated(false);
    //     // console.log(authenticated);
    //     navigate("/login"); // Redirect to login page after logout
    //   } else {
    //     // console.log(authenticated);
    //     console.error("Logout failed");
    //   }
    // } catch (error) {
    //   // console.log(authenticated);
    //   console.error("Error during logout:", error);
    // }
  };

  return (
    <>
      <div
        className={`w-64  h-screen flex flex-col fixed ${
          isDark ? "bg-[#343a40]" : "bg-[#e9ecef57]"
        }`}
      >
        {/* <div className={`w-64  h-screen flex flex-col fixed ${isDark ? "bg-[#343a40]" :"bg-[#e9ecef99]"}`}> */}
        {/* <div className="sideBar w-64 bg-[#fbfbfb] h-screen flex flex-col fixed font-display-main"> */}
        {/* Logo Section */}

        <div className="relative">
          {isSidebarOpen && (
            <img
              src={isDark ? close_dark : close_icon}
              width={14}
              alt="Close sidebar"
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer absolute top-4 right-4 z-50"
            />
          )}

          <div className="flex items-center flex-col gap-1 mt-2 p-2">
            <div>
              <img src={qlogo} alt="Logo" className="w-10 h-10" />
            </div>
            <h1 className="changeText text-[1.3em] text-[#283E46] font-bold font-display">
              Worksoft Buddy
            </h1>
            {/* <h1 className="changeText text-[1.3em] text-[#283E46] font-bold font-display">
              HR BOT
            </h1> */}
          </div>
        </div>

        {/* History Chat Section */}
        <div className="flex flex-col flex-grow overflow-y-auto mt-2">
          <div className="flex items-center gap-1.5 rounded-[10px]  px-2 py-2 mx-1.5 justify-center">
            {/* <div className="querySet flex items-center gap-1.5 rounded-[10px]  px-2 py-2 mx-1.5  bg-[#9ca3af38]"> */}
            <img
              className="imageChange"
              src={isDark ? chatHistory_light : chatHistory_icon}
              width={20}
              alt="History Icon"
            />
            <p className="changeText text-[1.1em] text-[#283E46] font-semibold ">
              History
            </p>
          </div>

          {/* Chat History */}
          <div className=" historySection flex-1 overflow-y-auto px-2 py-2">
            <ChatHistory
              chat={chatHistory}
              onSelect={onSelect}
              isDark={isDark}
              sendingIndex={activeIndex}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>
        </div>

        {/* User Profile at the bottom */}
        <div className="mt-auto">
          <UserProfile userName={userName} />
        </div>
      </div>
    </>
  );
};

export default SideBar;
