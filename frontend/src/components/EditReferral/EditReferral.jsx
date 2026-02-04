import { useContext, useEffect, useState } from "react";
import { useAuth } from "../UserContext/UserContext";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";
import groupDiscussion from "../../assets/images/new_gd_inactive.svg";
import groupDiscussionActive from "../../assets/images/new_gd_active.svg"; //for completed rounds
import groupDiscussionCompleted from "../../assets/images/new_gd_completed.svg"; // when you click
import technical from "../../assets/images/new_ta_inactive.svg";
import technicalActive from "../../assets/images/new_ta_active.svg";
import technicalCompleted from "../../assets/images/new_ta_completed.svg";
import hrRound from "../../assets/images/new_hr_inactive.svg";
import hrRoundActive from "../../assets/images/new_hr_active.svg";
import hrRoundCompleted from "../../assets/images/new_hr_complete.svg";
import "./editReferral.css";

const EditReferral = ({ referral, closeModal, fetchCurrent }) => {
  const { authState } = useAuth();
  const userIdAccess = authState?.user?.userId;
  // const [activeStage, setActiveStage] = useState(() => {
  //   if (referral.status === "Emailed") {
  //     return 1;
  //   }
  //   return null;
  // });
  const [activeStage, setActiveStage] = useState();
  const [finalValue, setFinalValue] = useState("");
  const [prevData, setPrevData] = useState({});
  const [isFeedback, setFeedback] = useState("");
  const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [ratingsData, setRatingsData] = useState({});
  const [selectedStage, setSelectedStage] = useState("");
  const [isError, setError] = useState("");
  const [isInfo, setInfo] = useState("");
  const [isReason, setReason] = useState("");
  const [isUpdateError, setUpdateError] = useState("");
  const { isTheme } = useContext(ThemeContext);
  const [isCompletedGD, setIsCompletedGD] = useState(true);
  const [isCompletedTA, setIsCompletedTA] = useState(true);
  const [isCompletedHR, setIsCompletedHR] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [permissionToRatingsForm, setPermissionToRatingsForm] = useState("");
  const [isInfoMessage, setIsInfoMessage] = useState(false);
  const [gdCompletedInfo, setGdCompletedInfo] = useState(false);
  const [taCompletedInfo, setTaCompletedInfo] = useState(false);
  const [hrCompletedInfo, setHrCompletedInfo] = useState(false);

  const [hrMailInfo, setHrMailInfo] = useState(""); // HR mail already sent info

  const infoMessages = [
    // 0 - Rejecting in GD after Technical is done
    "This candidate has already been rated in the Technical round. Rejecting them in Group Discussion will change their final status to Rejected, but the technical rating will still be stored for reference.",

    // 1 - Rejecting in Technical after HR is done
    "This candidate has already been rated in the HR round. Rejecting them in Technical Assessment will change their final status to Rejected, but the HR rating will still be stored for reference.",

    // 2 - Rejecting in HR after clearing GD & TA
    "This candidate has already cleared all previous rounds. Rejecting them in HR round will change their final status to Rejected, but previous ratings will still be stored for reference.",

    // 3 - HR mail already sent
    "This candidate has already received the HR round mail. Rejecting them in an earlier round will mark them as Rejected, but the HR mail remains sent.",

    // 4 - GD done, rejecting in Technical (preserve GD)
    "This candidate has already been rated in the Group Discussion round. Rejecting them in Technical Assessment will change their final status to Rejected, but the GD rating will still be stored for reference.",
    "This candidate has already completed Group Discussion and Technical Assessment, and the HR round mail has already been sent. Rejecting them in Technical Assessment will change their final status to Rejected, but prior ratings and mail status will remain.",
  ];

  const colorShades = [
    "#e0f2e9", // 1
    "#c8e6d4", // 2
    "#a5d7b5", // 3
    "#82c996", // 4
    "#5fbb77", // 5
    "#4ca762", // 6
    "#449c47", // 7
    "#3d8d40", // 8
    "#377e3a", // 9
    "#306f33", // 10
  ];

  const redShades = [
    "#fee8e7", // 1
    "#fbbbb6", // 2
    "#f88e86", // 3
    "#f66156", // 4
    "#f33325", // 5
  ];

  const stages = [
    "Submitted", //0
    "Group Discussion", //1
    "Technical Assessment", //2
    "HR Round", //3
    "Selected", //4
    "Rejected", //5
  ];
  const dateInterview = new Date(referral.roundDate);
  const accessToRatingsForm = dateInterview.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const currentSatus = referral.status;
    const mailSent = referral.mailStatus;
    console.log("currentStatus", currentSatus);
    console.log("mailSent", mailSent);
    if (referral?.roundDate) {
      const dateInterview = new Date(referral.roundDate);
      const accessToRatingsForm = dateInterview.toISOString().split("T")[0];
      const today = new Date().toISOString().split("T")[0];
      // alert(accessToRatingsForm > today);

      if (currentSatus === "Selected" && referral.mailStatus === "Sent") {
        setPermissionToRatingsForm("Offer Sent to Candidate");

        // setIsDisabled(false);
        // console.log("UPCOMING");
      } else if (accessToRatingsForm > today) {
        setPermissionToRatingsForm(
          "Access to this form will be granted on the scheduled interview date."
        );
        setIsDisabled(true);
      }

      // else if (accessToRatingsForm === today) {

      //   setPermissionToRatingsForm("");
      //   const shouldDisable =
      //     referral.interviewResult === "Pending" ? false : true;
      //   setIsDisabled(shouldDisable);
      // } else {
      //   setPermissionToRatingsForm("");
      //   const shouldDisable =
      //     referral.interviewResult === "Pending" ? false : true;
      //   setIsDisabled(shouldDisable);
      // }
    } else if (currentSatus === "Selected" && mailSent === "Not Sent") {
      // alert("here");
      setPermissionToRatingsForm(
        "Candidate selected — offer letter not yet sent."
      );
      setIsDisabled(false);
    } else if (currentSatus === "Rejected" && mailSent === "Not Sent") {
      setPermissionToRatingsForm("Rejection email has not been sent yet. ");
    } else if (currentSatus === "Rejected" && mailSent === "Sent") {
      setPermissionToRatingsForm("");
    } else if (currentSatus === "HR Round" && mailSent === "Not Sent") {
      setPermissionToRatingsForm(
        "Interview date has not been scheduled yet for HR round"
      );
      setIsDisabled(true);
      console.log("hello");
    } else {
      setPermissionToRatingsForm("Interview date has not been scheduled yet.");
    }
  }, [referral?.roundDate]); // Runs only when roundDate changes
  const rejectedStage = referral.rejectedIn;
  // console.log("rejectedStage", rejectedStage);
  // console.log("referral.status", referral.status); // the round in which he is selected

  const rejectedStageIndex = stages.indexOf(rejectedStage);
  // console.log("REJECTED", rejectedStageIndex);
  const stageIndex = rejectedStageIndex;

  const nextStageIndex =
    activeStage !== null && activeStage < stages.length - 1
      ? activeStage + 1
      : null;
  const nextStageName = stages[activeStage + 1];

  const currentStageIndex = stages.indexOf(referral.status);

  useEffect(() => {
    const rounds = referral.interviewRounds;
    console.log("rounds", rounds);

    if (!(rounds?.length > 0)) {
      console.log("No interview rounds available");
      setIsCompletedGD(false);
      setIsCompletedTA(false);
      setIsCompletedHR(false);
      setIsDisabled(true); // disable if no rounds exist
      return;
    }

    const hasCompletedGD = rounds.some(
      (round) =>
        (round.status === "Completed" || round.status === "Rejected") &&
        round.round === "Group Discussion"
    );

    const hasCompletedTA = rounds.some(
      (round) =>
        (round.status === "Completed" || round.status === "Rejected") &&
        round.round === "Technical Assessment"
    );

    const hasCompletedHR = rounds.some(
      (round) =>
        (round.status === "Completed" || round.status === "Rejected") &&
        round.round === "HR Round"
    );

    setIsCompletedGD(hasCompletedGD);
    setIsCompletedTA(hasCompletedTA);
    setIsCompletedHR(hasCompletedHR);
    setGdCompletedInfo(hasCompletedGD);
    setTaCompletedInfo(hasCompletedTA);
    setHrCompletedInfo(hasCompletedHR);
    // console.log("GD Completed:", hasCompletedGD);
    // console.log("Technical Assessment Completed:", hasCompletedTA);
    // console.log("HR Round Completed:", hasCompletedHR);

    if (hasCompletedGD) {
      setIsDisabled(false);
    } else if (hasCompletedTA) {
      setIsDisabled(false);
    } else if (hasCompletedHR) {
      setIsDisabled(false);
    } else {
      // aler
      setIsDisabled(false);
    }

    // Enable if any round is Completed or Rejected
    // if (hasCompletedGD|| hasCompletedTA || hasCompletedHR) {
    //   alert(hasCompletedTA)
    //   setIsDisabled(false);
    // } else {
    //   setIsDisabled(true);
    // }
  }, [referral.interviewRounds]);

  const handleFormClick = (round) => {
    if (round >= 0 && round < stages.length) {
      // alert(round);
      setActiveStage(round);
      setSelectedStage(stages[round]);
      // if (
      //   referral.rejectedIn === stages[round] &&
      //   referral.status === "Rejected"
      // ) {
      //   alert(referral.status);
      // }
      // console.log(`Round ${round} clickedRated - Stage: ${stages[round]}`);
      if (stages[round] === "Group Discussion") {
        setIsCompletedGD(false);
        setIsCompletedTA(false);
        setIsCompletedHR(false);
        setIsInfoMessage("");
        setInfo("");
        if (
          stages[round] === "Group Discussion" &&
          referral.status === "Selected"
        ) {
          setIsDisabled(true);
        }
      } else if (stages[round] === "Technical Assessment") {
        console.log(isCompletedTA);
        // alert("hascompleted ta", isCompletedTA)
        setIsCompletedGD(true);
        setIsCompletedTA(false);
        setIsCompletedHR(false);
        setIsInfoMessage("");
        setInfo("");

        if (
          stages[round] === "Technical Assessment" &&
          referral.status === "Selected"
        ) {
          setIsDisabled(true);
        }
      } else if (stages[round] === "HR Round") {
        setIsCompletedGD(true);
        setIsCompletedTA(true);
        setIsCompletedHR(false);
        setIsInfoMessage("");
        setInfo("");

        if (stages[round] === "HR Round" && referral.status === "Selected") {
          setIsDisabled(true);
        }
      }
    }
  };

  const handleRadioChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    console.log(selectedStage);
    console.log(isCompletedTA);
    if (selectedValue < 6) {
      // console.log("less than 6", selectedValue < 6);
      // console.log("GD Completed:", isCompletedGD);
      // console.log("Technical Assessment Completed:", isCompletedTA);
      // console.log("HR Round Completed:", hasCompletedHR);
      setInfo("Rating less than 6 will be Rejected");

      if (selectedStage === "Group Discussion" && taCompletedInfo) {
        console.log("");
        setIsInfoMessage(infoMessages[0]);
      } else if (selectedStage === "Technical Assessment" && hrCompletedInfo) {
        setIsInfoMessage(infoMessages[1]);
      } else if (
        selectedStage === "HR Round" &&
        gdCompletedInfo &&
        taCompletedInfo
      ) {
        setIsInfoMessage(infoMessages[2]);
      } else if (
        selectedStage === "HR Round" &&
        gdCompletedInfo &&
        taCompletedInfo &&
        referral.mailStatus === "Sent"
      ) {
        setIsInfoMessage(infoMessages[3]);
      } else if (selectedStage === "Technical Assessment" && isCompletedGD) {
        setIsInfoMessage(infoMessages[4]);
      } else if (
        selectedStage === "Technical Assessment" &&
        gdCompletedInfo &&
        taCompletedInfo &&
        referral.mailStatus === "Sent"
      ) {
        setIsInfoMessage(infoMessages[5]);
      }
    } else if (selectedValue >= 6) {
      setInfo("");
      setIsInfoMessage("");
    }

    setFinalValue(selectedValue);
    setFinalValue(e.target.value);
  };

  const handleInputChange = (e) => {
    const selectedValue = parseInt(e.target.value);
    console.log("from input", selectedStage);
    console.log(isCompletedTA);
    if (selectedValue < 6) {
      console.log(selectedValue < 6);
      setInfo("Rating less than 6 will be Rejected");
      if (selectedStage === "Group Discussion" && taCompletedInfo) {
        console.log("");
        setIsInfoMessage(infoMessages[0]);
      } else if (selectedStage === "Technical Assessment" && gdCompletedInfo) {
        setIsInfoMessage(infoMessages[1]);
      } else if (selectedStage === "Technical Assessment" && hrCompletedInfo) {
        setIsInfoMessage(infoMessages[1]);
      } else if (
        selectedStage === "HR Round" &&
        gdCompletedInfo &&
        taCompletedInfo
      ) {
        setIsInfoMessage(infoMessages[2]);
      } else if (
        selectedStage === "HR Round" &&
        gdCompletedInfo &&
        taCompletedInfo &&
        referral.mailStatus === "Sent"
      ) {
        setIsInfoMessage(infoMessages[3]);
      }
    } else if (selectedValue >= 6) {
      setInfo("");
      setIsInfoMessage("");
    }

    setFinalValue(selectedValue);
    setFinalValue(e.target.value);
  };

  const integerPart = Math.floor(parseFloat(finalValue)) || null;

  const getRate = async (e) => {
    e.preventDefault();
    console.log("referral", referral);
    if (!finalValue || !isFeedback) {
      setError("Enter the rating and feedback!");
      return;
    }
    const rating = parseFloat(finalValue);

    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError("Rating must be a number between 1 and 10");
      return;
    }
    let updatedStageName = nextStageName;
    console.log("updateStageName", updatedStageName);
    let rejectedIn = null;
    if (referral.rejectedIn === undefined && rating < 6) {
      // alert(selectedStage);
      rejectedIn = selectedStage;
      // updatedStageName = "Rejected";
    } else if (rating < 6) {
      console.log("here");
      // alert(selectedStage);
      // alert(referral.status);
      // setInfo("Ratings with less than 6 the candidate is rejected!");
      // updatedStageName = "Rejected";
      // rejectedIn = nextStageName;
      // rejectedIn = referral.status;
      rejectedIn = selectedStage;
    }
    // if (rating < 6) {
    //   // setInfo("Ratings with less than 6 the candidate is rejected!");
    //   // updatedStageName = "Rejected";
    //   // rejectedIn = nextStageName;
    //   console.log("here");
    //   // setInfo("Ratings with less than 6 the candidate is rejected!");
    //   updatedStageName = "Rejected";
    //   // rejectedIn = nextStageName;
    //   // rejectedIn = referral.status;
    //   rejectedIn = referral.status;
    // }

    if (!isReason) {
      // toast.error()
      setUpdateError("Reason is required for updating!");
      return;
    }
    const data = {
      finalValue,
      isFeedback,
      // referralId: referral._id,
      // status: referral.status,
      userIdAccess,
      nextStageName: updatedStageName,
      isReason,
      rejectedIn,
    };

    console.log(data, "dataaaaaaaaaaa");
    // process.exit();
    // exit();
    // console.log(
    //   `URL:http://localhost:3000/api/v1/referral/roundUpdate/${referral._id}/${selectedStage}`
    // );
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/referral/roundUpdate/${referral._id}/${selectedStage}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      // console.log(response);
      if (response.ok) {
        toast.success("Ratings updated Successful");

        closeModal();
        fetchCurrent();
      } else {
        toast.error("Failed to update ratings");
      }
    } catch (error) {
      console.log(error.name);
      console.log(error.message);
    }
  };

  const referralStatusIndex = stages.indexOf(referral.status);

  useEffect(() => {
    console.log("here");
    if (!selectedStage || !referral?._id) return;
    console.log("SELECTED STAGE", selectedStage);
    console.log("REFERRAL ID", referral._id);

    const fetchRatings = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/referral/ratings/${referral._id}/${selectedStage}`
        );

        console.log("response", response);
        const data = await response.json();
        // console.log(data);
        if (response.ok) {
          // setPrevData(data);
          setPrevData(data[0] || {});
        }
        // console.log(prevData);
      } catch (error) {
        console.error("Error fetching ratings", error);
      }
    };

    fetchRatings();
  }, [referral, selectedStage]);

  useEffect(() => {
    // console.log(prevData,"previous data object")
    if (prevData) {
      setFeedback(prevData.feedback ?? "");
      setFinalValue(prevData.finalRating ?? "");
      // setReason(prevData.isReason ?? "");
      if (
        Array.isArray(prevData.updateDetails) &&
        prevData.updateDetails.length > 0
      ) {
        const sortedUpdates = [...prevData.updateDetails].sort((a, b) => {
          const dateA = new Date(a.updatedAt || a.createdAt);
          const dateB = new Date(b.updatedAt || b.createdAt);
          return dateB - dateA;
        });

        setReason(sortedUpdates[0].isReason ?? "");
      } else {
        setReason("");
      }
    } else {
      setFeedback("");
      setFinalValue("");
      setReason("");
    }
  }, [prevData]);

  // const isDisabled = activeStage <= referralStatusIndex;

  const renderFormContent = (referral) => {
    switch (activeStage) {
      case 1:
        return (
          <div
            className="gd-round"
            style={{
              backgroundColor: isTheme ? "#343a40" : "#e9f5db",
              color: isTheme ? "white" : "black",
            }}
          >
            <form onSubmit={getRate}>
              <h1 className="roundName">Group Discussion Rating</h1>
              <div className="rate-feedback">
                <div className="roundRate">
                  <p>Rating</p>
                  <div>
                    <div
                      className="rate_Form"
                      style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
                    >
                      <div>
                        <label htmlFor="referralRate">
                          How would you rate it?
                        </label>
                        <div className="rateForm">
                          {ratings.map((num) => {
                            let color;

                            // If selected rating < 6, show red shades
                            if (integerPart < 6) {
                              color = redShades[num - 1];
                            } else {
                              color = colorShades[num - 1];
                            }

                            return (
                              <label
                                key={num}
                                className="rateLabel"
                                style={{
                                  backgroundColor:
                                    integerPart >= num ? color : "#f0f0f0",
                                  color: integerPart >= num ? "#fff" : "#000",
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
                                  borderColor:
                                    integerPart >= num ? color : "#ccc",
                                }}
                              >
                                <input
                                  type="radio"
                                  name="referralRate"
                                  value={num}
                                  disabled={isDisabled}
                                  onChange={handleRadioChange}
                                  checked={integerPart === num}
                                  style={{ display: "none" }}
                                />
                                {num}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="current-rate">
                        <label htmlFor="finalInput">Final</label>
                        <input
                          type="text"
                          id="finalInput"
                          // value={prevData._id}
                          style={{
                            pointerEvents: isDisabled ? "none" : "",
                            color: isTheme ? "white" : "black",
                          }}
                          readOnly={isDisabled}
                          value={finalValue || ""}
                          // onChange={handleInputChange}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              handleInputChange(e);
                              return;
                            }
                            if (/^\d{1,2}(\.\d{0,1})?$/.test(val)) {
                              const num = parseFloat(val);
                              if (num < 1) {
                                setInfo("Rating must be at least 1");
                              } else if (num > 10) {
                                setInfo("Rating cannot exceed 10");
                              } else if (num < 6) {
                                setInfo("Rating less than 6 will be Rejected");
                                // setIsInfoMessage(infoMessages[0]);
                                handleInputChange(e);
                              } else {
                                setInfo("");
                                // setIsInfoMessage("");
                                handleInputChange(e);
                              }
                            }
                          }}
                        />
                      </div>
                      {/* <div className="rate-error">
                        <div>
                          {isInfo && <p style={{ color: "red" }}>{isInfo}</p>}
                        </div>
                      </div> */}
                    </div>
                  </div>
                </div>
                <div className="roundRate">
                  <p>Feedback</p>
                  <textarea
                    name="one-feedback"
                    className="feed-text"
                    style={{
                      backgroundColor: isTheme ? "#6c757d" : "white",
                      pointerEvents: isDisabled ? "none" : "",
                    }}
                    value={isFeedback}
                    readOnly={isDisabled}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              </div>
              {/* <div>{isError && <p style={{ color: "red" }}>{isError}</p>}</div> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {isError && (
                  <div className="error-message" style={{ display: "flex" }}>
                    <img
                      src="./src/assets/images/error.svg"
                      width={18}
                      alt=""
                      style={{ marginBottom: "5px" }}
                    />
                    {isError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="updateRea">Reason to update!</label>
                <textarea
                  name="update_Rea"
                  id="updateRea"
                  style={{
                    backgroundColor: isTheme ? "#6c757d" : "white",
                    pointerEvents: isDisabled ? "none" : "",
                  }}
                  placeholder="Reason to update the referral!"
                  value={isReason}
                  readOnly={isDisabled}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                {/* <div>
                  {isUpdateError && (
                    <p style={{ color: "red" }}>{isUpdateError}</p>
                  )}
                </div> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isUpdateError && (
                    <div className="error-message" style={{ display: "flex" }}>
                      <img
                        src="./src/assets/images/error.svg"
                        width={18}
                        alt=""
                        style={{
                          marginBottom: "5px",
                          position: "relative",
                          top: "2px",
                          right: "4px",
                        }}
                      />
                      {isUpdateError}
                    </div>
                  )}
                </div>
              </div>
              <div className="infoMessage">
                {/* <span>Info:</span> */}
                {/* //css in editReferral.css */}
                <p className="infoMessageUI">{isInfoMessage}</p>
              </div>
              <div className="submitSection-round">
                <div className="prev-next-img">
                  <span className="count-page">{activeStage}</span>
                  <img
                    src="./src/assets/images/next-svgrepo-com(1).svg"
                    width={45}
                    alt=""
                    onClick={canClick(1) ? () => handleFormClick(2) : null}
                    style={{
                      cursor: canClick(1) ? "pointer" : "not-allowed",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  disabled={isDisabled}
                  // disabled={activeStage <= referralStatusIndex}
                >
                  <span className="update_btn submit_icon_align"></span>
                  Update
                </button>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <div
            className="gd-round"
            style={{
              backgroundColor: isTheme ? "#343a40" : "#e9f5db",
              color: isTheme ? "white" : "black",
            }}
          >
            <form onSubmit={getRate}>
              <h1 className="roundName">Technical Assessment Rating</h1>
              <div className="rate-feedback">
                <div className="roundRate">
                  <p>Rating</p>
                  <div>
                    <div
                      className="rate_Form"
                      style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
                    >
                      <div>
                        <label htmlFor="referralRate">
                          How would you rate it?
                        </label>
                        <div className="rateForm">
                          {ratings.map((num) => {
                            let color;

                            // If selected rating < 6, show red shades
                            if (integerPart < 6) {
                              color = redShades[num - 1];
                            } else {
                              color = colorShades[num - 1];
                            }

                            return (
                              <label
                                key={num}
                                className="rateLabel"
                                style={{
                                  backgroundColor:
                                    integerPart >= num ? color : "#f0f0f0",
                                  color: integerPart >= num ? "#fff" : "#000",
                                  cursor: isDisabled
                                    ? "not-allowed"
                                    : "pointer",
                                  borderColor:
                                    integerPart >= num ? color : "#ccc",
                                }}
                              >
                                <input
                                  type="radio"
                                  name="referralRate"
                                  value={num}
                                  disabled={isDisabled}
                                  onChange={handleRadioChange}
                                  checked={integerPart === num}
                                  style={{ display: "none" }}
                                />
                                {num}
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="current-rate">
                        <label htmlFor="finalInput">Final</label>
                        <input
                          type="text"
                          id="finalInput"
                          value={finalValue || ""}
                          // onChange={handleInputChange}
                          style={{
                            pointerEvents: isDisabled ? "none" : "",
                            color: isTheme ? "white" : "black",
                          }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              handleInputChange(e);
                              return;
                            }
                            if (/^\d{1,2}(\.\d{0,1})?$/.test(val)) {
                              const num = parseFloat(val);
                              if (num < 1) {
                                setInfo("Rating must be at least 1");
                              } else if (num > 10) {
                                setInfo("Rating cannot exceed 10");
                              } else if (num < 6) {
                                setInfo("Rating less than 6 will be Rejected");
                                // setIsInfoMessage(infoMessages[0]);

                                handleInputChange(e);
                              } else {
                                setInfo("");
                                handleInputChange(e);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="rate-error">
                        <div>
                          {isInfo && <p style={{ color: "red" }}>{isInfo}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="roundRate">
                  <p>Feedback</p>
                  <textarea
                    name="one-feedback"
                    className="feed-text"
                    style={{
                      backgroundColor: isTheme ? "#6c757d" : "white",
                      pointerEvents: isDisabled ? "none" : "",
                    }}
                    value={isFeedback}
                    readOnly={isDisabled}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              </div>
              {/* <div>{isError && <p style={{ color: "red" }}>{isError}</p>}</div> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {isError && (
                  <div className="error-message" style={{ display: "flex" }}>
                    <img
                      src="./src/assets/images/error.svg"
                      width={18}
                      alt=""
                      style={{ marginBottom: "5px" }}
                    />
                    {isError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="updateRea">Reason to update!</label>
                <textarea
                  name="update_Rea"
                  id="updateRea"
                  style={{
                    backgroundColor: isTheme ? "#6c757d" : "white",
                    pointerEvents: isDisabled ? "none" : "",
                  }}
                  placeholder="Reason to update the referral!"
                  value={isReason}
                  readOnly={isDisabled}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                {/* <div>
                  {isUpdateError && (
                    <p style={{ color: "red" }}>{isUpdateError}</p>
                  )}
                </div> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isUpdateError && (
                    <div className="error-message" style={{ display: "flex" }}>
                      <img
                        src="./src/assets/images/error.svg"
                        width={18}
                        alt=""
                        style={{
                          marginBottom: "5px",
                          position: "relative",
                          top: "2px",
                          right: "4px",
                        }}
                      />
                      {isUpdateError}
                    </div>
                  )}
                </div>
              </div>
              <div className="infoMessage">
                {/* <span>Info:</span> */}
                {/* //css in editReferral.css */}
                <p className="infoMessageUI">{isInfoMessage}</p>
              </div>
              <div className="submitSection-round">
                <div className="prev-next-img">
                  <img
                    src="./src/assets/images/downward-svgrepo-com.svg"
                    width={45}
                    alt=""
                    onClick={canClick(1) ? () => handleFormClick(1) : null}
                    style={{
                      cursor: canClick(1) ? "pointer" : "not-allowed",
                    }}
                  />
                  <span className="count-page">{activeStage}</span>
                  <img
                    src="./src/assets/images/next-svgrepo-com(1).svg"
                    width={45}
                    alt=""
                    onClick={canClick(3) ? () => handleFormClick(3) : null}
                    style={{
                      cursor: canClick(3) ? "pointer" : "not-allowed",
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  disabled={isDisabled}

                  // disabled={activeStage <= referralStatusIndex}
                >
                  <span className="update_btn submit_icon_align"></span>
                  Update
                </button>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <div
            className="gd-round"
            style={{
              backgroundColor: isTheme ? "#343a40" : "#e9f5db",
              color: isTheme ? "white" : "black",
            }}
          >
            <form onSubmit={getRate}>
              <h1 className="roundName">HR Round Rating</h1>
              <div className="rate-feedback">
                <div className="roundRate">
                  <p>Rating</p>
                  <div>
                    <div
                      className="rate_Form"
                      style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
                    >
                      <label htmlFor="referralRate">
                        How would you rate it?
                      </label>
                      <div className="rateForm">
                        {ratings.map((num) => {
                          let color;

                          // If selected rating < 6, show red shades
                          if (integerPart < 6) {
                            color = redShades[num - 1];
                          } else {
                            color = colorShades[num - 1];
                          }

                          return (
                            <label
                              key={num}
                              className="rateLabel"
                              style={{
                                backgroundColor:
                                  integerPart >= num ? color : "#f0f0f0",
                                color: integerPart >= num ? "#fff" : "#000",
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                borderColor:
                                  integerPart >= num ? color : "#ccc",
                              }}
                            >
                              <input
                                type="radio"
                                name="referralRate"
                                value={num}
                                disabled={isDisabled}
                                onChange={handleRadioChange}
                                checked={integerPart === num}
                                style={{ display: "none" }}
                              />
                              {num}
                            </label>
                          );
                        })}
                      </div>
                      <div className="current-rate">
                        <label htmlFor="finalInput">Final</label>
                        <input
                          type="text"
                          // id="finalInput"
                          // readOnly={isDisabled}

                          style={{
                            pointerEvents: isDisabled ? "none" : "",
                            color: isTheme ? "white" : "black",
                          }}
                          value={finalValue || ""}
                          // onChange={handleInputChange}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              handleInputChange(e);
                              return;
                            }
                            if (/^\d{1,2}(\.\d{0,1})?$/.test(val)) {
                              const num = parseFloat(val);
                              if (num < 1) {
                                setInfo("Rating must be at least 1");
                              } else if (num > 10) {
                                setInfo("Rating cannot exceed 10");
                              } else if (num < 6) {
                                setInfo("Rating less than 6 will be Rejected");
                                handleInputChange(e);
                              } else {
                                setInfo("");
                                handleInputChange(e);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="rate-error">
                        <div>
                          {isInfo && <p style={{ color: "red" }}>{isInfo}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="roundRate">
                  <p>Feedback</p>
                  <textarea
                    name="one-feedback"
                    className="feed-text"
                    style={{
                      backgroundColor: isTheme ? "#6c757d" : "white",
                      pointerEvents: isDisabled ? "none" : "",
                    }}
                    value={isFeedback}
                    readOnly={isDisabled}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              </div>
              {/* <div>{isError && <p style={{ color: "red" }}>{isError}</p>}</div> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {isError && (
                  <div className="error-message" style={{ display: "flex" }}>
                    <img
                      src="./src/assets/images/error.svg"
                      width={18}
                      alt=""
                      style={{ marginBottom: "5px" }}
                    />
                    {isError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="updateRea">Reason to update!</label>
                <textarea
                  name="update_Rea"
                  id="updateRea"
                  style={{
                    backgroundColor: isTheme ? "#6c757d" : "white",
                    pointerEvents: isDisabled ? "none" : "",
                  }}
                  placeholder="Reason to update the referral!"
                  value={isReason}
                  onChange={(e) => setReason(e.target.value)}
                  readOnly={isDisabled}
                ></textarea>
                {/* <div>
                  {isUpdateError && (
                    <p style={{ color: "red" }}>{isUpdateError}</p>
                  )}
                </div> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isUpdateError && (
                    <div className="error-message" style={{ display: "flex" }}>
                      <img
                        src="./src/assets/images/error.svg"
                        width={18}
                        alt=""
                        style={{
                          marginBottom: "5px",
                          position: "relative",
                          top: "2px",
                          right: "4px",
                        }}
                      />
                      {isUpdateError}
                    </div>
                  )}
                </div>
              </div>
              <div className="infoMessage">
                {/* <span>Info:</span> */}
                {/* //css in editReferral.css */}
                <p className="infoMessageUI">{isInfoMessage}</p>
              </div>
              <div className="submitSection-round">
                <div className="prev-next-img">
                  <img
                    src="./src/assets/images/downward-svgrepo-com.svg"
                    width={45}
                    alt=""
                    onClick={canClick(2) ? () => handleFormClick(2) : null}
                    style={{
                      cursor: canClick(2) ? "pointer" : "not-allowed",
                    }}
                  />
                  {/* <span className="count-page">{activeStage}</span> */}
                  {/* <img
                    src="./src/assets/images/next-svgrepo-com(1).svg"
                    width={45}
                    alt=""
                    onClick={canClick(4) ? () => handleFormClick(4) : null}
                    style={{
                      cursor: canClick(4) ? "pointer" : "not-allowed",
                    }}
                  /> */}
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  disabled={isDisabled}

                  // disabled={activeStage <= referralStatusIndex}
                >
                  <span className="update_btn submit_icon_align"></span>
                  Update
                </button>
              </div>
            </form>
          </div>
        );
      case 4:
        return (
          <div
            className="gd-round"
            style={{
              backgroundColor: isTheme ? "#343a40" : "#e9f5db",
              color: isTheme ? "white" : "black",
            }}
          >
            <form onSubmit={getRate}>
              <h1 className="roundName">Selected Rating</h1>
              <div className="rate-feedback">
                <div className="roundRate">
                  <p>Rating</p>
                  <div>
                    <div
                      className="rate_Form"
                      style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
                    >
                      <label htmlFor="referralRate">
                        How would you rate it?
                      </label>
                      <div className="rateForm">
                        {ratings.map((num) => (
                          <label key={num} className="rateLabel">
                            <input
                              type="radio"
                              name="referralRate"
                              value={num}
                              // disabled={isDisabled}
                              onChange={handleRadioChange}
                              // checked={finalValue === num.toString()}
                              // checked={
                              //   prevData
                              //     ? Math.floor(prevData.finalRating) === num
                              //     : num
                              // }
                              checked={integerPart === num}
                            />
                            {num}
                          </label>
                        ))}
                      </div>
                      <div className="current-rate">
                        <label htmlFor="finalInput">Final</label>
                        <input
                          type="text"
                          id="finalInput"
                          value={finalValue || ""}
                          // readOnly={isDisabled}

                          style={{ color: isTheme ? "white" : "black" }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === "") {
                              handleInputChange(e);
                              return;
                            }
                            if (/^\d{1,2}(\.\d{0,1})?$/.test(val)) {
                              const num = parseFloat(val);
                              if (num < 1) {
                                setInfo("Rating must be at least 1");
                              } else if (num > 10) {
                                setInfo("Rating cannot exceed 10");
                              } else if (num < 6) {
                                setInfo("Rating less than 6 will be Rejected");
                                handleInputChange(e);
                              } else {
                                setInfo("");
                                handleInputChange(e);
                              }
                            }
                          }}
                        />
                      </div>
                      <div className="rate-error">
                        <div>
                          {isInfo && <p style={{ color: "red" }}>{isInfo}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="roundRate">
                  <p>Feedback</p>
                  <textarea
                    name="one-feedback"
                    className="feed-text"
                    style={{
                      backgroundColor: isTheme ? "#6c757d" : "white",
                      pointerEvents: isDisabled ? "none" : "",
                    }}
                    value={isFeedback}
                    readOnly={isDisabled}
                    onChange={(e) => setFeedback(e.target.value)}
                  ></textarea>
                </div>
              </div>
              {/* <div>{isError && <p style={{ color: "red" }}>{isError}</p>}</div> */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {isError && (
                  <div className="error-message" style={{ display: "flex" }}>
                    <img
                      src="./src/assets/images/error.svg"
                      width={18}
                      alt=""
                      style={{ marginBottom: "5px" }}
                    />
                    {isError}
                  </div>
                )}
              </div>
              <div>
                <label htmlFor="updateRea">Reason to update!</label>
                <textarea
                  name="update_Rea"
                  id="updateRea"
                  style={{
                    backgroundColor: isTheme ? "#6c757d" : "white",
                    pointerEvents: isDisabled ? "none" : "",
                  }}
                  placeholder="Reason to update the referral!"
                  value={isReason}
                  readOnly={isDisabled}
                  onChange={(e) => setReason(e.target.value)}
                ></textarea>
                {/* <div>
                  {isUpdateError && (
                    <p style={{ color: "red" }}>{isUpdateError}</p>
                  )}
                </div> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {isUpdateError && (
                    <div className="error-message" style={{ display: "flex" }}>
                      <img
                        src="./src/assets/images/error.svg"
                        width={18}
                        alt=""
                        style={{
                          marginBottom: "5px",
                          position: "relative",
                          top: "2px",
                          right: "4px",
                        }}
                      />
                      {isUpdateError}
                    </div>
                  )}
                </div>
              </div>
              <div className="infoMessage">
                {/* <span>Info:</span> */}
                {/* //css in editReferral.css */}
                <p className="infoMessageUI">{isInfoMessage}</p>
              </div>
              <div className="submitSection-round">
                <div className="prev-next-img">
                  <img
                    src="./src/assets/images/downward-svgrepo-com.svg"
                    width={45}
                    alt=""
                    onClick={canClick(3) ? () => handleFormClick(3) : null}
                    style={{
                      cursor: canClick(3) ? "pointer" : "not-allowed",
                    }}
                  />
                  <span className="count-page">{activeStage}</span>
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  disabled={isDisabled}

                  // disabled={stages[activeStage] === referral.status}
                  // disabled={activeStage <= referralStatusIndex}
                >
                  <span className="update_btn submit_icon_align"></span>
                  Update
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  const handleClick = (stageIndex) => {
    if (stageIndex <= rejectedStageIndex) {
      handleFormClick(stageIndex);
    }
  };

  const rejectedIndex =
    referral.status === "Rejected" ? stages.indexOf(referral.rejectedIn) : -1;

  console.log("Rejected index", rejectedIndex);
  console.log("currentStageIndex ", currentStageIndex);
  console.log("status", referral.status);
  console.log("status", referral.interviewResult);

  // const canClick = (stageNumber) => {
  //   console.log(stageNumber);
  //   if (referral.status === "Rejected") {
  //     // alert(stageNumber <= rejectedIndex)
  //     // Allow click only if stageNumber <= rejectedIndex
  //     // console.log("stageNumber <= rejectedIndex", stageNumber <= rejectedIndex);
  //     return stageNumber <= rejectedIndex;
  //   } else if (
  //     referral.status === "Group Discussi" &&
  //     referral.interviewResult === "Pending"
  //   ) {
  //     return false;
  //   } else if (
  //     referral.status === "Technical Assessment" &&
  //     referral.interviewResult === "Pending"
  //   ) {
  //     console.log("here");
  //     return false;
  //   } else if (
  //     referral.status === "HR Round" &&
  //     referral.interviewResult === "Pending"
  //   ) {
  //     return false;
  //   } else {
  //     // Normal logic for non-rejected referrals
  //     console.log(
  //       "currentStageIndex >= stageNumber",
  //       currentStageIndex >= stageNumber
  //     );

  //     return currentStageIndex >= stageNumber;
  //   }
  // };
  const canClick = (stageNumber) => {
    if (referral.status === "Rejected") {
      return stageNumber <= rejectedIndex; // allow past stages only
    }

    const stageMap = {
      "Group Discussion": 1,
      "Technical Assessment": 2,
      "HR Round": 3,
    };

    const currentStage = stageMap[referral.status];
    //should allow clicking if the current stage is pending
    if (
      referral.interviewResult === "Pending" &&
      currentStage === stageNumber
    ) {
      return false;
    }

    return stageNumber <= currentStage;
  };

  return (
    <div className="modal-overlay">
      <div
        className="modal-box-two"
        style={{
          backgroundColor: isTheme ? "black" : "white",
          border: isTheme ? "1px solid gray" : "none",
        }}
      >
        <div>
          <div
            className={`noteForForm ${
              permissionToRatingsForm.toLowerCase().includes("not scheduled")
                ? "notScheduled"
                : "upcoming"
            } ${
              referral.status === "Selected" && referral.mailStatus === "Sent"
                ? "offerSent"
                : ""
            }`}
          >
            {/* <strong>Note:</strong> */}
            <p>{permissionToRatingsForm}</p>
          </div>
          <div className="heading-one">
            <h1
              className="rateFor"
              style={{ color: isTheme ? "white" : "black" }}
            >
              Edit Rating for {referral.referral_fname}{" "}
              {referral.referral_lname}
            </h1>
            <img
              src={
                isTheme
                  ? "./src/assets/images/close-circle-dark-svgrepo-com.svg"
                  : "./src/assets/images/close-circle-svgrepo-com.svg"
              }
              width={30}
              style={{ cursor: "pointer" }}
              alt=""
              onClick={() => closeModal()}
              className={permissionToRatingsForm ? "noteCloseIcon" : ""}
            />
          </div>

          <div className="rounds-sec">
            <div className="round-one">
              <div
                className="round-section"
                // onClick={canClick(1) ? () => handleFormClick(1) : null}
                style={{
                  // cursor: canClick(1) ? "pointer" : "not-allowed",
                  // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="Group Discussion"
              >
                <div className="round_one_div">
                  <span
                    onClick={canClick(1) ? () => handleFormClick(1) : null}
                    style={{
                      cursor: canClick(1) ? "pointer" : "not-allowed",
                      // border:
                      //   referral.status === "Rejected" &&
                      //   referral.rejectedIn === "Group Discussion"
                      //     ? "1px solid #ff4d4f"
                      //     : "1px solid #007bff",
                    }}
                    className={`${
                      isCompletedGD === true ? "completedBg" : "intiallRound"
                    } ${activeStage === 1 ? "roundsActive" : ""}`}
                    // className={`formOne ${
                    //   activeStage === 1 ? "activeBg" : "noBg"
                    // }`}
                  >
                    {activeStage === 1 ? (
                      <img
                        src={groupDiscussionCompleted}
                        alt="Group Discussion Active"
                        className="multiStepFormImage"
                      />
                    ) : isCompletedGD === true ? (
                      <img
                        src={groupDiscussionActive}
                        alt="Group Discussion Completed"
                        className="multiStepFormImage"
                      />
                    ) : (
                      <img
                        src={groupDiscussion}
                        alt="Group Discussion Default"
                        className="multiStepFormImage"
                      />
                    )}
                  </span>

                  <span
                    className={`${
                      isCompletedGD === true ? "completed" : "intialtext"
                    } ${activeStage === 1 ? "clickedRated" : ""}`}
                  >
                    Group Discussion
                  </span>
                </div>
                {/* <img
                  src={
                    isTheme
                      ? "./src/assets/images/groupDiscussion-dark.svg"
                      : "./src/assets/images/groupDiscussion.svg"
                  }
                  width={30}
                  alt=""
                /> */}
                <div>
                  <hr
                    className={`${
                      isCompletedGD === true ? "activeLine" : "line"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* <div
              className={`connect-line connect-line-${
                isTheme ? "dark" : "light"
              }`}
              style={{
                animationDelay: "0.6s",
                animationPlayState: "running",
                width: "5em",
              }}
            >
              <hr />
            </div> */}
            <div className="round-one">
              <div
                className="round-section"
                // onClick={canClick(2) ? () => handleFormClick(2) : null}
                style={{
                  // cursor: canClick(2) ? "pointer" : "not-allowed",
                  // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="Technical Assessment"
              >
                <div className="round_one_div">
                  <span
                    onClick={canClick(2) ? () => handleFormClick(2) : null}
                    style={{
                      cursor: canClick(2) ? "pointer" : "not-allowed",
                      // border:
                      //   referral.status === "Rejected" &&
                      //   referral.rejectedIn === "Technical Assessment"
                      //     ? "1px solid #ff4d4f"
                      //     : "1px solid #007bff",
                      // backgroundColor:
                      //   referral.status === "Rejected" &&
                      //   referral.rejectedIn === "Technical Assessment"
                      //     ? "red"
                      //     : "",
                    }}
                    className={`${
                      isCompletedTA === true ? "completedBg" : "intiallRound"
                    } ${activeStage === 2 ? "roundsActive" : ""}`}
                  >
                    {activeStage === 2 ? (
                      <img
                        src={technicalCompleted}
                        alt="technical Active"
                        className="multiStepFormImage"
                      />
                    ) : isCompletedTA === true ? (
                      <img
                        src={technicalActive}
                        alt="technical Completed"
                        className="multiStepFormImage"
                      />
                    ) : (
                      <img
                        src={technical}
                        alt="technical Default"
                        className="multiStepFormImage"
                      />
                    )}
                  </span>

                  <span
                    className={`${
                      isCompletedTA === true ? "completed" : "intialtext"
                    } ${activeStage === 2 ? "clickedRated" : ""}`}
                  >
                    Technical Assessment
                  </span>
                </div>
              </div>
              <div>
                <hr
                  className={` 
                     ${
                       isCompletedTA === true
                         ? "activeLineTwo"
                         : "lineAfterTechnical"
                     }`}
                />
              </div>
            </div>
            {/* <div
              className={`connect-line connect-line-${
                isTheme ? "dark" : "light"
              }`}
              style={{
                animationDelay: "0.6s",
                animationPlayState: "running",
                width: "5em",
              }}
            >
              <hr />
            </div> */}

            <div className="round-one">
              <div
                className="round-section"
                // onClick={canClick(3) ? () => handleFormClick(3) : null}
                style={{
                  // cursor: canClick(3) ? "pointer" : "not-allowed",
                  // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="HR Round"
              >
                <div className="round_one_div">
                  <span
                    onClick={canClick(3) ? () => handleFormClick(3) : null}
                    style={{
                      cursor: canClick(3) ? "pointer" : "not-allowed",
                    }}
                    className={`${
                      isCompletedHR === true ? "completedBg" : "intiallRound"
                    } ${activeStage === 3 ? "roundsActive" : ""}`}
                  >
                    {activeStage === 3 ? (
                      <img
                        src={hrRoundActive}
                        alt="HR Active"
                        className="multiStepFormImageHR"
                      />
                    ) : isCompletedHR === true ? (
                      <img
                        src={hrRoundCompleted}
                        alt="HR Completed"
                        className="multiStepFormImageHR"
                      />
                    ) : (
                      <img
                        src={hrRound}
                        alt="HR Default"
                        className="multiStepFormImageHR"
                      />
                    )}
                  </span>
                  <span
                    className={`${
                      isCompletedHR === true ? "completed" : "intialtext"
                    } ${activeStage === 3 ? "clickedRated" : ""}`}
                  >
                    HR Round
                  </span>
                </div>
                {/* <img
                  src={
                    isTheme
                      ? "./src/assets/images/hr-dark.svg"
                      : "./src/assets/images/hr.svg"
                  }
                  width={30}
                  alt=""
                /> */}
              </div>
            </div>
            {/* <div
              className={`connect-line connect-line-${
                isTheme ? "dark" : "light"
              }`}
              style={{
                animationDelay: "0.6s",
                animationPlayState: "running",
                width: "5em",
              }}
            >
              <hr />
            </div> */}
            {/* <div className="round-one">
              <div
                className="round-section"
                onClick={canClick(4) ? () => handleFormClick(4) : null}
                style={{
                  cursor: canClick(4) ? "pointer" : "not-allowed",
                  border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="Selected"
              >
                <img
                  src={
                    isTheme
                      ? "./src/assets/images/selected-dark.svg"
                      : "./src/assets/images/selected.svg"
                  }
                  width={30}
                  alt=""
                />
              </div>
            </div> */}
          </div>
          {renderFormContent(referral)}
        </div>
      </div>
    </div>
  );
};

export default EditReferral;
