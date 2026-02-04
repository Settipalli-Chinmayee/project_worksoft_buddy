import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import TimeDisplay from "../UIComponents/TimeDisplay";
import SideBar from "../SideBar/SideBar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; //for css imp
import DateTimeDisplay from "../DateTimeDisplay/DateTimeDisplay";
// import CookiesPopup from "../CookiesPopup/CookiesPopup";
import Cookies from "js-cookie";
import "./ChatInterface.css";
import aiImageForNote from "../../assets/images/aiNoteImage.svg";
// import { renderToStaticMarkup } from "react-dom/server";
// import aiImageForNote from "../../assets/images/aiNoteImage.svg";
import { renderToStaticMarkup } from "react-dom/server";
import linkArrow from "../../assets/images/linkArrow.svg";
import error from "../../assets/images/error.svg";
import cancel_Alert from "../../assets/images/cancelAlert.svg";
import menuDark from "../../assets/images/menu-dark-svgrepo-com.svg";
import questionDarkLink from "../../assets/images/questionDarkLink.svg";
import questionLink from "../../assets/images/questionLink.svg";
import menu from "../../assets/images/menu-svgrepo-com.svg";
import cancelDark from "../../assets/images/cancelDark.svg";
import cancel from "../../assets/images/cancel.svg";
import voice from "../../assets/images/voice.svg";
import hourGlass from "../../assets/images/hourglass-svgrepo-com.svg";
import hoverVoice from "../../assets/images/hoverVoice.svg";
import askDark from "../../assets/images/askDark.svg";
import askLight from "../../assets/images/askLight.svg";
import sendDark from "../../assets/images/send-dark-svgrepo-com.svg";
import trendUpDark from "../../assets/images/trendUp-dark.svg";
import trendUp from "../../assets/images/trendUp.svg";
import userHistoryDark from "../../assets/images/userhistory-dark.svg";
import userHistory from "../../assets/images/userHistory.svg";
import enterQueryDark from "../../assets/images/enterQuery-dark.svg";
import enterQuery from "../../assets/images/enterQuery.svg";
import user from "../../assets/images/user.svg";
import botImage from "../../assets/images/botImage.svg";
import userRespondedGoodImage from "../../assets/images/userRespondedGoodImage.svg";
import good_Response from "../../assets/images/goodResponse.svg";
import userRespondedBadImage from "../../assets/images/userRespondedBadImage.svg";
import bad_Response from "../../assets/images/badResponse.svg";
import tickSquare from "../../assets/images/tick-square-svgrepo-com.svg";
import copy from "../../assets/images/copy.svg";

const ChatInterface = () => {
  // console.log("isDark---",isDarks)

  useEffect(() => {
    document.title = "Worksoft Buddy";
  }, []);

  const location = useLocation();
  const authentication = location.state?.Authentication;
  const userEmail = location.state?.userEmail;
  const userName = location.state?.userName;
  const userId = location.state?.userId;
  // console.log(userName);
  // console.log(userId);
  const userDetails = { userEmail, userName };
  const [hasAcceptedCookies, setHasAcceptedCookies] = useState(false);
  // console.log(userDetails,'user details')
  // console.log(authentication, "auth");
  // useEffect(() => {
  //   document.title = "Worksoft Buddy";
  // }, []);

  const [question, setQuestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setAuthenticated] = useState("false");
  const [questionErrorMessage, setQuestionErrorMessage] = useState("");
  const chatContainerRef = useRef([]); // Use array instead of object
  const chatWrapperRef = useRef(null); // for the scrollable container
  const [isLoading, setIsLoading] = useState(false); //for placeholder
  const [activeIndex, setActiveIndex] = useState(false);
  const [goodResponse, setGoodResponse] = useState(false);
  const [badResponse, setBadResponse] = useState(false);
  const [removeResponse, setRemoveResponse] = useState(false);
  const [feedback, setFeedback] = useState([]); // to track feedback per message
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isImgHovered, setIsImgHovered] = useState(false);
  const [isVoice, setVoice] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const [isQueries, setIsQueries] = useState([]);
  const [isMode, setIsMode] = useState(null);
  //   if (matches) {
  //     console.log("Dark system");
  //     setIsDark(true);
  // } else {
  //   console.log("Light");
  //   setIsDark(false);
  // }

  // const chatContainerRef = useRef(null);
  const [questionIndex, setQuestionIndex] = useState(null);
  const [shouldForceScrollTop, setShouldForceScrollTop] = useState(false);
  const [suggestionClicked, setSuggestionClicked] = useState(false);
  const [queries, setQueries] = useState([]);
  const firstRow = queries.slice(0, 2);

  const secondRow = queries.slice(2, 4);

  // When user submits a new question:
  const handleSubmit = () => {
    // ... your current submit logic
    setShouldForceScrollTop(true); // Trigger scroll-to-top effect
  };

  const goodResponseFunc = () => {
    setGoodResponse(true);
    setRemoveResponse(true);
  };

  const badResponseFunc = () => {
    setBadResponse(true);
    setRemoveResponse(true);
  };
  const handleFeedback = (index, value) => {
    setFeedback((prevFeedback) => {
      const newFeedback = [...prevFeedback];
      const current = newFeedback[index];

      if (current === value) {
        newFeedback[index] = null; // Toggle off
      } else {
        newFeedback[index] = value;

        // Trigger your side-effects
        if (value === "good") {
          setGoodResponse(true);
          setRemoveResponse(true);
        } else if (value === "bad") {
          setBadResponse(true);
          setRemoveResponse(true);
        }
      }

      return newFeedback;
    });
  };

  useEffect(() => {
    const handleThemeChange = () => {
      const theme = localStorage.getItem("theme");

      // Check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      // Determine actual theme
      const isDarkMode =
        theme === "dark" || (theme === "system" && prefersDark);

      setIsDark(isDarkMode);

      // Update class on html tag
      document.documentElement.classList.toggle("dark", isDarkMode);
    };

    // Run initially
    handleThemeChange();

    // Watch for theme changes from app
    window.addEventListener("theme-changed", handleThemeChange);

    // Watch for localStorage changes (other tabs)
    window.addEventListener("storage", handleThemeChange);

    // Watch for system theme changes (if system mode is selected)
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      window.removeEventListener("theme-changed", handleThemeChange);
      window.removeEventListener("storage", handleThemeChange);
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // const isDark = localStorage.getItem("theme") === "dark";
  const handleSelect = (index) => {
    // console.log("index", index);
    setQuestionIndex(index);
    setActiveIndex(index);
  };

  // this useEffect is to scroll to specific chat item based on the index
  useEffect(() => {
    if (questionIndex !== null && chatContainerRef.current[questionIndex]) {
      // console.log("questionIndex", questionIndex);
      chatContainerRef.current[questionIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      // setQuestionIndex(u);
      // console.log("Question is Highlighted");
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setQuestionIndex(null);
      }, 3000);
    }
  }, [questionIndex]);

  // Runs after chat is updated
  useEffect(() => {
    if (chatWrapperRef.current) {
      chatWrapperRef.current.scrollTop = 0;
    }
  }, [chatHistory]);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch(
        "https://worksoftbuddyapi.qualesce.com/api/v1/users/hrbot",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        navigate("/login");
      }
      if (response.ok) {
        const getQueries = await fetch(
          "https://worksoftbuddyapi.qualesce.com/api/v1/users/userQueries",
          {
            method: "GET",
          }
        );
        const data = await getQueries.json();
        const filteredData = data.filter((item) => {
          const text = item._id.toLowerCase();
          return text !== "hi" && text !== "hi, how are you?";
        });

        // console.log("rate limit", userId);
        setQueries(filteredData);
        // const rateLimit = await fetch(
        //   `http://localhost:3000/api/v1/users/userQueries/${userId}`,
        //   {
        //     method: "GET",
        //   }
        // );
      }
    };
    checkAuth();
  }, [navigate, setQueries]);

  let clearQuestion = () => {
    // console.log("yes");
    setQuestion("");
  };

  //This function used to format the bot response
  function formatText(text) {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    const elements = [];
    let tableLines = [];
    let isTable = false;
    let keyCounter = 0;

    const parseInlineElements = (text) => {
      const regex =
        /(\*\*(.*?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|([^\n:]+):\s*(https?:\/\/[^\s]+)|https?:\/\/[^\s]+)/g;

      const parts = [];
      let lastIndex = 0;
      let match;
      let index = 0;

      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }

        if (match[1]?.startsWith("**")) {
          parts.push(<b key={`bold-${index}`}>{match[2]}</b>);
        } else if (match[3] && match[4]) {
          parts.push(
            <a
              key={`link-${index}`}
              href={match[4]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0077b6] underline inline-flex items-center gap-1"
              style={{
                backgroundColor: "#9ca3af1f",
                padding: "7px 10px",
                borderRadius: "25px",
                marginBottom: "10px",
              }}
            >
              {match[3]}
              <img
                src={linkArrow}
                alt="external link"
                width={14}
                height={14}
                style={{
                  width: "18px",
                  position: "relative",
                  right: "3px",
                  top: "2px",
                }}
              />
            </a>
          );
        } else if (match[5] && match[6]) {
          const label = match[5].trim();
          const url = match[6].trim();
          parts.push(
            <a
              key={`auto-label-link-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#0077b6] underline"
              style={{
                backgroundColor: "#9ca3af1f",
                padding: "7px 10px",
                borderRadius: "25px",
              }}
            >
              {label}
              <img
                src={linkArrow}
                alt="external link"
                width={14}
                height={14}
                style={{
                  width: "18px",
                  position: "relative",
                  right: "3px",
                  top: "2px",
                }}
              />
            </a>
          );
        } else if (match[0].startsWith("http")) {
          const url = match[0];
          parts.push(
            <a
              key={`url-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              style={{
                backgroundColor: "#9ca3af1f",
                padding: "7px 10px",
                borderRadius: "25px",
              }}
            >
              {url}
            </a>
          );
        }

        lastIndex = regex.lastIndex;
        index++;
      }

      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts;
    };

    const processTable = (lines) => {
      let headerRow = null;
      let tableData = [];

      const isSeparatorLine = (line) => /^(\s*\|?\s*-+\s*\|)+\s*$/.test(line);

      lines.forEach((line, index) => {
        let hashText = line.trim().startsWith("###");
        if (hashText || line.trim().startsWith("-----")) return;
        if (isSeparatorLine(line)) return;

        const cells = line
          .split("|")
          .map((cell) => cell.trim())
          .filter(
            (cell, i, arr) =>
              !(i === 0 && arr.length > 1 && cell === "") && cell !== ""
          );

        if (index === 0) {
          headerRow = cells;
        } else {
          tableData.push(cells);
        }
      });

      return (
        <table key={keyCounter++} className="bot_table">
          <thead>
            <tr>
              {headerRow &&
                headerRow.map((header, idx) => (
                  <th key={`header-${idx}`} className="bot_table_header">
                    {header.replace(/\*\*(.*?)\*\*/g, "$1")}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, rowIdx) => (
              <tr key={`row-${rowIdx}`}>
                {row.map((cell, colIdx) => {
                  const cleanedCell = cell
                    .replace(/<br\s*\/?>/gi, "\n") // Replace <br> with newlines
                    .replace(/^\s*-\s*/gm, "• "); // Bullet point replacement

                  const processed = parseInlineElements(cleanedCell);

                  return (
                    <td
                      key={`cell-${rowIdx}-${colIdx}`}
                      className="border px-4 py-2"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {processed}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
    };

    const flushTableIfNeeded = () => {
      if (isTable) {
        elements.push(processTable(tableLines));
        tableLines = [];
        isTable = false;
      }
    };

    lines.forEach((line) => {
      let formattedLine = line.trim().replace(/\\\]/g, "");

      if (formattedLine.includes("|")) {
        isTable = true;
        tableLines.push(formattedLine);
      } else {
        flushTableIfNeeded();

        // if (/^#{2,6}\s/.test(formattedLine)) {
        //   const headingText = formattedLine.replace(/^#{2,6}\s*/, "");
        //   elements.push(
        //     <h3 key={keyCounter++} className="mt-4 font-semibold text-lg">
        //       {headingText}
        //     </h3>
        //   );
        // }
        if (/^#{2,6}\s/.test(formattedLine)) {
          let headingText = formattedLine.replace(/^#{2,6}\s*/, "");

          // If the heading starts with ###, remove any bold markers (**)
          if (formattedLine.startsWith("###")) {
            headingText = headingText.replace(/\*\*(.*?)\*\*/g, "$1");
          }

          elements.push(
            <h3 key={keyCounter++} className="mt-4 font-semibold text-lg">
              {headingText}
            </h3>
          );
        } else if (/^[-]{3,}$/.test(formattedLine)) {
          elements.push(
            <hr key={keyCounter++} className="my-2 border-gray-300" />
          );
        } else {
          elements.push(
            <p key={keyCounter++} style={{ whiteSpace: "pre-line" }}>
              {parseInlineElements(formattedLine)}
            </p>
          );
        }
      }
    });

    flushTableIfNeeded();

    return elements;
  }

  //This function is used for when users clicks on Submit
  //  const submitForm = (e) => {
  //   e.preventDefault();

  //   console.log(question);
  //   return question;
  // }

  // useEffect(() => {
  //   const inputQuery = (queryText) => {
  //     //   console.log("query for input", queryText);
  //     if (suggestionClicked) {
  //       setQuestion(queryText);
  //     }
  //     // const [suggestionClicked, setSuggestionClicked] = useState(false);
  //     // console.log(text,"text")
  //   };
  // }, []);

  const askQuestion = async (e, customQuestion = null) => {
    if (e) e.preventDefault();
    setIsDropdown(false);
    const questionToAsk = customQuestion || question;

    if (!questionToAsk.trim()) {
      setQuestionErrorMessage("Kindly enter your question.");
      return;
    }

    setQuestionErrorMessage("");
    const activeTheIndex = chatHistory.length;
    setActiveIndex(activeTheIndex);
    setIsSidebarOpen(false);
    setShouldForceScrollTop(true);
    setQuestion("");
    setIsClicked(true);
    setIsLoading(true);

    const newChat = {
      question: questionToAsk,
      answer: "Thinking...",
      timestamp: new Date().toISOString(),
    };

    setChatHistory([newChat, ...chatHistory]);
    setFeedback((prev) => [null, ...prev]);
    setActiveIndex(0);
    document.activeElement.blur();

    try {
      const response = await fetch(
        `https://worksoftbuddyapi.qualesce.com/api/v1/users/ask`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: questionToAsk, userName, userId }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch response");

      const data = await response.json();
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[0] = {
          ...updated[0],
          answer: formatText(data.answer),
        };
        return updated;
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const cookieExpiryDate = Cookies.get("cookieExpiryDate"); // Retrieve expiry date
    const currentDate = new Date();

    // If the cookie doesn't exist or if the expiry date has passed, show the popup
    if (!cookieExpiryDate || new Date(cookieExpiryDate) < currentDate) {
      setHasAcceptedCookies(false); // Show the popup
    } else {
      setHasAcceptedCookies(true); // Hide the popup if cookies are valid
    }
  }, []);
  const extractText = (children) => {
    if (!children) return "";

    if (Array.isArray(children)) {
      return children.map(extractText).join(" "); // Recursively extract text
    }

    if (typeof children === "object" && children.props) {
      return extractText(children.props.children); // Dive into nested elements
    }

    return typeof children === "string" ? children : ""; // Return if it's a string
  };

  // const CopyBotAnswer = (answerArray, index) => {
  //   // console.log(copied)
  //   // console.log(answerArray)
  //   const textToCopy =
  //     answerArray
  //       .map((item) => (item.props ? extractText(item.props.children) : ""))
  //       .join("\n") + "\n\nAI can make mistakes,use responsibly!";

  //   navigator.clipboard
  //     .writeText(textToCopy)
  //     .then(() => {
  //       setCopied(true); // Change to tick icon
  //       setCopiedIndex(index);
  //       setTimeout(() => setCopied(false), 2000);
  //       setTimeout(() => setCopiedIndex(null), 2000);
  //       // console.log('copied',textToCopy)
  //     })
  //     .catch((err) => {
  //       // alert ("Failed to copy:", err)
  //       console.error("Failed to copy:", err);
  //     });
  // };

  const formatTableToHTML = (tableElement) => {
    return renderToStaticMarkup(tableElement);
  };

  const formatTableToPlainText = (tableElement) => {
    const extractText = (node) => {
      if (typeof node === "string" || typeof node === "number")
        return node.toString();
      if (Array.isArray(node)) return node.map(extractText).join(" ");
      if (React.isValidElement(node)) return extractText(node.props.children);
      return "";
    };

    const extractRows = (section) => {
      if (!section) return [];
      const rowArray = React.Children.toArray(section.props.children);
      return rowArray.map((tr) => {
        const cellArray = React.Children.toArray(tr.props.children);
        return cellArray.map((cell) => {
          const raw =
            typeof cell === "string"
              ? cell
              : extractText(cell?.props?.children);
          return raw.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        });
      });
    };

    const childrenArray = React.Children.toArray(tableElement.props.children);

    const thead = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === "thead"
    );
    const tbody = childrenArray.find(
      (child) => React.isValidElement(child) && child.type === "tbody"
    );

    const headRows = extractRows(thead);
    const bodyRows = extractRows(tbody);
    const allRows = [...headRows, ...bodyRows];

    if (allRows.length === 0) return "";

    const colWidths = [];
    allRows.forEach((row) =>
      row.forEach((cell, i) => {
        colWidths[i] = Math.max(colWidths[i] || 0, (cell || "").length);
      })
    );

    const pad = (text = "", length) => text + " ".repeat(length - text.length);

    const lines = allRows.map((row) =>
      row.map((cell, i) => pad(cell, colWidths[i])).join(" | ")
    );

    if (headRows.length > 0) {
      const separator = colWidths.map((w) => "-".repeat(w)).join("-|-");
      lines.splice(1, 0, separator);
    }

    return lines.join("\n");
  };

  const copyAsHTMLAndPlainText = async (htmlString, plainText) => {
    const htmlBlob = new Blob([htmlString], { type: "text/html" });
    const textBlob = new Blob([plainText], { type: "text/plain" });

    const clipboardItem = new ClipboardItem({
      "text/html": htmlBlob,
      "text/plain": textBlob,
    });

    await navigator.clipboard.write([clipboardItem]);
  };

  const CopyBotAnswer = async (answerArray, index) => {
    const extractText = (node) => {
      if (typeof node === "string" || typeof node === "number")
        return node.toString();
      if (Array.isArray(node)) return node.map(extractText).join("");
      if (React.isValidElement(node)) return extractText(node.props.children);
      return "";
    };

    try {
      const containsTable = answerArray.some((item) => item.type === "table");

      if (containsTable) {
        const tableElement = answerArray.find((item) => item.type === "table");

        const beforeTable = answerArray
          .slice(
            0,
            answerArray.findIndex((el) => el.type === "table")
          )
          .map((el) => (el?.props ? extractText(el.props.children) : ""))
          .join("\n");

        const afterTable = answerArray
          .slice(answerArray.findIndex((el) => el.type === "table") + 1)
          .map((el) => (el?.props ? extractText(el.props.children) : ""))
          .join("\n");

        const htmlToCopy = `
        <div>
          <p>${beforeTable}</p>
          ${formatTableToHTML(tableElement)}
          <p>${afterTable}</p>
      
          <p><em>AI-generated output. Kindly verify before use.</em></p>
        </div>
      `;
        // <p><em>AI can make mistakes, use responsibly!</em></p>
        const plainTextTable = formatTableToPlainText(tableElement);
        const plainTextToCopy = [
          beforeTable,
          plainTextTable,
          afterTable,
          "AI-generated output. Kindly verify before use.",
        ]
          // const plainTextToCopy = [beforeTable, plainTextTable, afterTable, "AI can make mistakes, use responsibly!"]
          .filter(Boolean)
          .join("\n\n");

        await copyAsHTMLAndPlainText(htmlToCopy, plainTextToCopy);

        setCopied(true);
        setCopiedIndex(index);
        setTimeout(() => setCopied(false), 2000);
        setTimeout(() => setCopiedIndex(null), 2000);
        // console.log("Copied HTML + PlainText");
        return;
      }

      // No table - plain text only
      const textToCopy =
        answerArray
          .map((item) => (item.props ? extractText(item.props.children) : ""))
          .join("\n") + "\n\nAI-generated output. Kindly verify before use.";
      // .join("\n") + "\n\nAI can make mistakes, use responsibly!";

      await navigator.clipboard.writeText(textToCopy);

      setCopied(true);
      setCopiedIndex(index);
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setCopiedIndex(null), 2000);
      // console.log("Copied plain text only");
    } catch (err) {
      alert("Failed to copy: " + err.message);
      console.error("Copy error:", err);
    }
  };

  const cancelAlert = () => {
    setQuestionErrorMessage("");
  };

  useEffect(() => {
    if (questionErrorMessage) {
      const alertTimer = setTimeout(() => {
        setQuestionErrorMessage("");
      }, 2500);
      return () => clearTimeout(alertTimer);
    }
  }, [questionErrorMessage]);

  const inputQuery = (queryText) => {
    // console.log("query for input", suggestionClicked);

    setQuestion(queryText);
    setSuggestionClicked(true);
    askQuestion(null, queryText);
  };

  const voiceQuestion = () => {
    console.log("voice search");
    setVoice(true);
  };

  const handleChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleClick = () => {
    displayQueries();
  };
  // displayQueries();

  const displayQueries = async () => {
    // console.log("display 5 questions");
    // let userId = userId
    console.log("is focused on input", isFocused);

    setIsDropdown(true);
    console.log(userId);
    try {
      const response = await fetch(
        `https://worksoftbuddyapi.qualesce.com/api/v1/users/${userId}/getQuestion`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("response for question", data);
      if (response.ok && data?.recentQueries) {
        setIsQueries(data.recentQueries);
        setIsMode("recent");
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  const searchQuestions = async (query) => {
    console.log("debounce", query);
    setIsDropdown(true);
    setIsMode("search");

    try {
      const response = await fetch(
        `https://worksoftbuddyapi.qualesce.com/api/v1/users/${userId}/getQuestion/${query}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      console.log("response for search text", data);
      if (response.ok) {
        setIsQueries(data);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    if (isDropdown) {
      displayQueries();
    }
  }, [isDropdown]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = question.trim();
      if (trimmed !== "") {
        console.log("Debounced input:", question);
        searchQuestions(trimmed);
      } else {
        setIsMode(null);
        setIsDropdown(false);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [question]);

  const questionToInput = (index) => {
    // console.log("q",index)
    setQuestion(index);
  };

  return (
    <>
      {/* <div className="chatInterface"> */}
      <div className="chatInterface">
        <div className="chatInterFace_Section">
          {/* Sidebar */}

          <div
            className={`sideBar ${isSidebarOpen ? "closed" : "open"}`}
            style={{ boxShadow: "0px 0px 4px lightgray" }}
          >
            <SideBar
              chatHistory={chatHistory}
              onSelect={handleSelect}
              isDark={isDark}
              activeIndex={activeIndex}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </div>

          {/* Main Content */}
          <div className="mainContent">
            {/* Will display the error when question is not entered */}
            {questionErrorMessage && (
              <div className="questionErrorSection">
                <img src={error} className="errorImage" alt="Error" />
                <p className="questionText">{questionErrorMessage}</p>
                <img
                  src={cancel_Alert}
                  className="cancelAlert"
                  onClick={cancelAlert}
                />
                <div className="toast-border-progress"></div>
              </div>
            )}

            <button
              className="menuButton"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <img
                src={isDark ? menuDark : menu}
                className="menuIconImage"
                alt="Menu"
              />
            </button>
            {isSidebarOpen && (
              <div
                className={`fixed inset-0  z-30 lg:hidden`}
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <form
              className={`formSection ${
                isClicked
                  ? isDark
                    ? "clicked dark"
                    : "clicked light"
                  : "default"
              }`}
            >
              <div className="mainChatInterFace_RightSide">
                {!isClicked && (
                  <div className="welcomeContent">
                    <h1 className="headingOne welcomeHeading">Welcome to,</h1>
                    <h1 className="headingOne  hrBotHeading ">Worksoft Buddy</h1>
                    {/* <h1 className={`text-3xl font-semibold font-display mb-2  subHeading ${isDark ? "dark-theme-text-gradient" :"text-gradient"}`}> */}
                    {/* <h1 className={`text-3xl font-semibold font-display mb-2  subHeading text-gradient`}> */}
                    <h1 className="subHeading subheading_hr">
                      Your Virtual Assistant
                    </h1>
                    <div className="ripple_effect">
                      <span></span>
                    </div>
                    <div className="questionsDisplaySection">
                      <div className="questionDisplayContainer">
                        <p
                          className="questionText"
                          style={{
                            backgroundColor: isDark ? "#9ca3af38" : "#9ca3af1f",
                            color: isDark ? "white" : "black",
                          }}
                          onClick={() => {
                            inputQuery("Hi, How are you?");
                            setSuggestionClicked(true);
                          }}
                          title="Hi, How are you?"
                        >
                          <span className="truncate flex-grow">
                            Hi, How are you?
                          </span>
                          <img
                            // src="./src/assets/images/questionLink.svg"
                            src={isDark ? questionDarkLink : questionLink}
                            alt="external link"
                            width={14}
                            height={14}
                            className="ml-2"
                            style={{ width: "15px" }}
                          />
                        </p>

                        {firstRow.map((query, index) => (
                          <p
                            key={`first-${index}`}
                            className="questionRows"
                            style={{
                              backgroundColor: isDark
                                ? "#9ca3af38"
                                : "#9ca3af1f",
                              color: isDark ? "white" : "black",
                            }}
                            onClick={() => {
                              inputQuery(query._id);
                              setSuggestionClicked(true);
                            }}
                            title={query._id}
                          >
                            <span className="truncate flex-grow">
                              {query._id}
                            </span>
                            <img
                              src={isDark ? questionDarkLink : questionLink}
                              alt="external link"
                              width={14}
                              height={14}
                              className="ml-2"
                              style={{ width: "15px" }}
                            />
                          </p>
                        ))}
                      </div>

                      <div className="flex justify-center gap-6 flex-wrap">
                        {secondRow.map((query, index) => (
                          <p
                            key={`second-${index}`}
                            className="questionRows"
                            style={{
                              backgroundColor: isDark
                                ? "#9ca3af38"
                                : "#9ca3af1f",
                              color: isDark ? "white" : "black",
                            }}
                            onClick={() => {
                              inputQuery(query._id);
                              setSuggestionClicked(true);
                            }}
                            title={query._id}
                          >
                            <span className="truncate flex-grow">
                              {query._id}
                            </span>
                            <img
                              // src="./src/assets/images/questionLink.svg"
                              src={isDark ? questionDarkLink : questionLink}
                              alt="external link"
                              width={14}
                              height={14}
                              className="ml-2"
                              style={{ width: "15px" }}
                            />
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="inputQueryContainer">
                  <div className="inputQuerySection">
                    <input
                      type="text"
                      value={question}
                      // onChange={(e) => setQuestion(e.target.value)}
                      // onChange={handleChange}
                      // onClick={displayQueries}
                      onChange={handleChange}
                      onClick={handleClick}
                      disabled={isLoading}
                      placeholder={
                        isLoading
                          ? "Our assistant is working on your request..."
                          : "Type your question..."
                      }
                      className={`inputText
    ${isLoading ? "loading" : ""}
    ${isDark ? "dark" : "light"}`}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      style={{ minHeight: "40px", height: "auto" }}
                    />

                    {isFocused && question && (
                      <img
                        src={isDark ? cancelDark : cancel}
                        alt="cancel"
                        width="20"
                        className="cancelIcon"
                        onMouseDown={clearQuestion}
                      />
                    )}
                  </div>
                  <div
                    style={{ marginRight: "10px" }}
                    className="listening_btn"
                    onClick={voiceQuestion}
                  >
                    {isLoading ? (
                      <>
                        <img
                          src={voice}
                          width={24}
                          // style={{ marginLeft: "7px" }}
                          className="hidden sm:block "
                          alt="Voice Icon"
                        />
                        {/* <span className="hidden sm:block">Listening...</span> */}
                        <img
                          src={hourGlass}
                          className="block sm:hidden w-5 h-5 fill-current"
                          alt=""
                        />
                      </>
                    ) : (
                      <div className="voiceIconSection">
                        {/* Desktop text and icon */}
                        {/* <span className="hidden sm:block">Voice</span> */}
                        <img
                          src={voice}
                          width={24}
                          // style={{ marginLeft: "7px" }}
                          className="hidden sm:block "
                          alt="Voice Icon"
                        />

                        {/* Mobile hover icon logic */}
                        <div className="block sm:hidden relative w-5 h-5 ml-[7px]">
                          <img
                            src={voice}
                            className="absolute top-0 left-0 w-5 h-5 group-hover:hidden"
                            alt="Voice Icon"
                          />
                          <img
                            src={hoverVoice}
                            className="absolute top-0 left-0 w-5 h-5 hidden group-hover:block"
                            alt="Hover Voice Icon"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* {isVoice ? (
                    <div>
                      <p>Voice search pop up</p>
                    </div>
                  ):(
                    <div>
                      <p>No voice pop up</p>
                    </div>
                  )} */}
                  <button
                    onClick={askQuestion}
                    onMouseEnter={() => setIsImgHovered(true)}
                    onMouseLeave={() => setIsImgHovered(false)}
                    className="askbtn bg-[#283E46] relative left-[10px] pt-2 pb-2  text-[1.1em] rounded-full border-2 border-[#283E46] text-[#ffc300] font-semibold hover:bg-white hover:border-[#283E46] hover:text-[#283E46] cursor-pointer shadow-md transition duration-300 px-5"
                  >
                    {isLoading ? (
                      <>
                        <span className="hidden sm:block">Thinking...</span>
                        <img
                          src={hourGlass}
                          className="block sm:hidden w-5 h-5 fill-current"
                          alt=""
                        />
                      </>
                    ) : (
                      <>
                        <span
                          className="hidden sm:block"
                          style={{ display: "flex" }}
                          // style={{ width: "5em", padding: "6px 10px" }}
                        >
                          Ask{" "}
                          <img
                            src={isImgHovered ? askDark : askLight}
                            className="block w-4 h-4 fill-current"
                            alt=""
                          />
                        </span>
                        <img
                          src={sendDark}
                          className="block sm:hidden w-5 h-5 fill-current"
                          alt=""
                        />
                      </>
                    )}
                  </button>
                </div>
                {isDropdown && (
                  <div
                    className={`debounceView debounce-${
                      isDark ? "dark" : "light"
                    } ${isFocused || question.trim() !== "" ? "show" : ""}`}
                  >
                    {isMode === "recent" &&
                      (isFocused || question.trim() !== "") && (
                        <>
                          {isQueries.length > 0 ? (
                            isQueries.map((item, index) => (
                              <div
                                key={`recent-${index}`}
                                className="recentQuery show"
                                onMouseDown={() =>
                                  questionToInput(item.userQuery)
                                }
                              >
                                <img
                                  src={isDark ? trendUpDark : trendUp}
                                  alt=""
                                  width={24}
                                />
                                <p className="displayRecent">
                                  {item.userQuery}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p style={{ padding: "0.5rem", color: "#888" }}>
                              No queries found.
                            </p>
                          )}
                        </>
                      )}

                    {isMode === "search" && question.trim() !== "" && (
                      <>
                        {isQueries.length > 0 ? (
                          isQueries.map((item, index) => (
                            <div
                              key={`search-${index}`}
                              className="debounceQuery"
                              onMouseDown={() =>
                                questionToInput(item.userQuery)
                              }
                            >
                              <div className="user_History">
                                <img
                                  src={isDark ? userHistoryDark : userHistory}
                                  alt="user-history"
                                  className="userHistory-img"
                                />
                                <p>{item.userQuery}</p>
                              </div>
                              <img
                                src={isDark ? enterQueryDark : enterQuery}
                                alt="Enter Query"
                                className="userHistorySend-img"
                              />
                            </div>
                          ))
                        ) : (
                          <p style={{ padding: "0.5rem", color: "#888" }}>
                            No queries found.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Chat History (Fixed with Auto-Scroll) */}
            <div
              ref={chatWrapperRef}
              // className=" w-full  max-w-[1000px] flex-1 mt-20 p-4 max-h-screen overflow-y-auto scrollbar-hidden"
              className="w-full max-w-[1000px] flex-1 mt-[10px] md:mt-[15px] lg:mt-20 p-4 max-h-screen overflow-y-auto scrollbar-hidden "

              // className=" w-full  max-w-[1000px] flex-1 mt-20 p-4 bg-[#f9f9f9] rounded-lg shadow-inner"
              // style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}
            >
              {(chatContainerRef.current = [])}{" "}
              {chatHistory.map((chat, index) => (
                // const isActive = index === Number(questionIndex);

                <div
                  key={index}
                  ref={(el) => (chatContainerRef.current[index] = el)}
                  className="flex flex-col gap-4"
                >
                  {/* User Query */}
                  <div className=" flex flex-col gap-1.5 w-fit">
                    <div
                      className={` querySet ${
                        isDark ? "bg-[#9ca3af38]" : "bg-gray-50"
                      } flex items-center w-fit rounded-[25px] mb-2 p-[7px]`}
                    >
                      <img
                        src={user}
                        className="relative left-[1px] bottom-[2px]"
                        alt="User"
                        width="16px"
                      />
                      <p className="text-[0.6em] sm:text-[0.75em] md:text-base lg:text-[0.65em] text-[gray] relative left-[4px] top-[0px]">
                        My Query
                      </p>
                    </div>
                    <div
                      key={index}
                      className={`botQuestionTheme text-[12px] md:text-[14px] lg:text-[16px]
    ${isDark ? "bg-[#9ca3af38] text-[#E5E6E4]" : "bg-[#e5e7eb] text-black"} 
    py-2 px-4 rounded-[25px] w-fit break-words 
    ${
      index === questionIndex
        ? "border-[#ffc300] border-2 shadow-md"
        : "border-transparent border-2"
    } 
    transition-all duration-300`}
                    >
                      <p>{chat.question}</p>
                    </div>

                    <div
                      className={`querySet ${
                        isDark ? "bg-[#9ca3af38]" : "bg-gray-50"
                      }   self-end mt-1 rounded-[25px]`}
                    >
                      <DateTimeDisplay timestamp={chat.timestamp} />
                    </div>
                  </div>

                  {/* Bot Response */}
                  {/* <div className="self-end  px-4 py-2 w-[75%]"> */}

                  <div
                    className={`self-end  px-4 py-2 ${
                      chat.answer === "Thinking..."
                        ? "w-[75%]"
                        : "w-auto max-w-[75%]"
                    } inline-block break-words overflow-hidden`}
                  >
                    <div className=" flex justify-end">
                      <div
                        className={`querySet ${
                          isDark ? "bg-[#9ca3af38]" : "bg-gray-50"
                        } gap-1.5 flex w-fit  rounded-[25px] mb-2 p-[5px]`}
                      >
                        <img
                          src={botImage}
                          className="relative left-[1px] bottom-[2px]"
                          alt="Bot"
                          width="20px"
                        />
                        <p className="text-[0.6em] sm:text-[0.75em] md:text-base lg:text-[0.65em] text-[gray] relative top-[3px]">
                          Bot Response
                        </p>
                      </div>
                    </div>
                    <div>
                      {chat.answer === "Thinking..." ? (
                        <div className="w-75%">
                          <SkeletonTheme
                            baseColor={isDark ? "#4b556380" : "#e0e0e0"} // Dark mode slightly darker gray, Light mode stays the same
                            highlightColor={isDark ? "#6b7280" : "#f5f5f5"} // Dark or Light highlight color
                            // baseColor="#e0e0e0"
                            // highlightColor="#f5f5f5"
                          >
                            <Skeleton
                              height={10}
                              width="100%"
                              className="my-2 rounded-full"
                            />
                            <Skeleton
                              height={10}
                              width="70%"
                              className="my-2 rounded-full"
                            />
                            <Skeleton
                              height={10}
                              width="50%"
                              className="my-2 rounded-full"
                            />
                            {/* <Skeleton count = {3} height={10} className="my-2 rounded-full"  ></Skeleton> */}
                          </SkeletonTheme>
                        </div>
                      ) : (
                        <>
                          <div
                            key={index}
                            className={`changeText text-[12px] md:text-[14px] lg:text-[16px] rounded-[10px] px-1.5 py-1.5 ${
                              isDark ? "text-[#E5E6E4] " : "text-black"
                            }`}
                          >
                            {chat.answer}
                            <div
                              className="flex justify-end text-xs text-[#adb5bdc4] items-center"
                              style={{ marginTop: "10px" }}
                            >
                              <img
                                src={aiImageForNote}
                                className="aiImageOfNote"
                                alt=""
                              />
                              <span>
                                {/* AI may produce errors; therefore, it should be
                                used responsibly. */}
                                {/* AI can make mistakes,use responsibly! */}
                                {/* AI content may be inaccurate. Verify before use. */}
                                AI-generated output. Kindly verify before use.
                              </span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <div className="flex mt-1 gap-1">
                              {feedback[index] === "good" ? (
                                <img
                                  src={userRespondedGoodImage}
                                  width="20px"
                                  alt=""
                                  className="cursor-pointer"
                                  title="Informative"
                                />
                              ) : (
                                <img
                                  src={good_Response}
                                  width="20px"
                                  alt="Informative"
                                  title="Informative"
                                  onClick={() => handleFeedback(index, "good")}
                                  className={`cursor-pointer ${
                                    feedback[index] === "bad" ||
                                    feedback[index] === "good"
                                      ? "hidden"
                                      : ""
                                  }`}
                                  // title="Helpfull Response"
                                />
                              )}
                              {feedback[index] === "bad" ? (
                                <img
                                  src={userRespondedBadImage}
                                  width="20px"
                                  alt=""
                                  title="Didn’t Help"
                                  className="cursor-pointer"
                                />
                              ) : (
                                <img
                                  src={bad_Response}
                                  width="20px"
                                  alt=""
                                  title="Didn’t Help"
                                  onClick={() => handleFeedback(index, "bad")}
                                  className={`cursor-pointer ${
                                    feedback[index] === "bad" ||
                                    feedback[index] === "good"
                                      ? "hidden"
                                      : ""
                                  }`}
                                />
                              )}

                              <img
                                src={copiedIndex === index ? tickSquare : copy}
                                width="22px"
                                alt=""
                                className="cursor-pointer"
                                onClick={() =>
                                  CopyBotAnswer(chat.answer, index)
                                }
                                title={
                                  copiedIndex === index ? "Copied!" : "Copy"
                                }
                              />
                            </div>
                            {/* <div className="flex justify-end text-xs text-[#adb5bd] items-center">
                              Note: AI may produce errors; therefore, it should be used responsibly.
                            </div> */}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* <p className="text-[0.6em] sm:tex-[0.8em] md:text-[0.8em] lg:text-sm text-[#6f6e6e]">
              Note: This website is not fully accessible to individuals with
              physical disabilities.
            </p> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatInterface;
