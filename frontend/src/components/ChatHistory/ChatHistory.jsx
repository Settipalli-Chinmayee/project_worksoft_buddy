import React, { useRef } from "react";
import { useState } from "react";

// const isDark = localStorage.getItem("theme") === "dark";
const ChatHistory = ({
  chat,
  onSelect,
  isDark,
  sendingIndex,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  // console.log("chathistoory", sendingIndex);
  console.log("isSidebarOpen", isSidebarOpen);

  // let userQuery = '';
  // console.log(isDark,'in history')

  // if (chat.role === 'user') {
  //   userQuery = chat.question;
  // }

  return (
    <>
      {/* Working code */}
      {/* <ul className="px-2 py-2 mx-1.5" > */}
      <ul className="historyQuestionsSection rounded-[10px]">
        {/* <ul className="historyQuestionsSection bg-[#9ca3af38] rounded-[10px]"> */}
        {chat.map((chat, index) => (
          <li
            key={index}
            onClick={() => {
              onSelect(index);

              if (isSidebarOpen) {
                setIsSidebarOpen(false);
              }
            }}
            className={`flex justify-between items-center px-2 py-2 cursor-pointer  ${
              index === sendingIndex
                ? "border-r-3 border-[#ffc300] rounded-full bg-[#9ca3af1f]"
                : "border-r-3 border-transparent"
            } `}
            style={{ color: isDark ? "white" : "black" }}
          >
            {/* <span className={`overflow-hidden capitalize text-ellipsis whitespace-nowrap ${isDark ? "text-white" : "text-black"}`} > */}
            <span
              className={`overflow-hidden capitalize text-ellipsis  whitespace-nowrap  text-sm `}
            >
              {chat.question.charAt(0).toUpperCase() + chat.question.slice(1)}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ChatHistory;
