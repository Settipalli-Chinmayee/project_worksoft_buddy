import { useEffect, useState } from "react";
import "./rateReferral.css";
import { useAuth } from "../UserContext/UserContext";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";
// import completeRating from "../../assets/images/completeRatings.svg";
// import rejectedRating from "../../assets/images/rejectedStatus.svg";
import groupDiscussion from "../../assets/images/new_gd_inactive.svg";
import groupDiscussionActive from "../../assets/images/new_gd_active.svg"; //for completed rounds
import groupDiscussionCompleted from "../../assets/images/new_gd_completed.svg"; // when you click
import technical from "../../assets/images/new_ta_inactive.svg";
import technicalActive from "../../assets/images/new_ta_active.svg";
import technicalCompleted from "../../assets/images/new_ta_completed.svg";
import hrRound from "../../assets/images/new_hr_inactive.svg";
import hrRoundActive from "../../assets/images/new_hr_active.svg";
import hrRoundCompleted from "../../assets/images/new_hr_complete.svg";

const RateReferral = ({ referral, closeModal, fetchCurrent, referralId, fetchCurrentTable }) => {
  const { authState } = useAuth();
  const userIdAccess = authState?.user?.userId;
  // const [activeStage, setActiveStage] = useState(() => {
  //   if (referral.status === "Submitted" && referral.mailStatus === "Sent") {
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
  const { isTheme } = useContext(ThemeContext);
  // const [completedSteps, setCompletedSteps] = useState("")
  const [completedSteps, setCompletedSteps] = useState([]);
  const [dataInterviewProcess, setDataInterviewProcess] = useState({});
  const [permissionToRatingsForm, setPermissionToRatingsForm] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisbledSubmitBtn, setIsDisabledSubmitBtn] = useState(true);
  const [isCompletedGD, setIsCompletedGD] = useState(true);
  const [isCompletedTA, setIsCompletedTA] = useState(true);
  const [isCompletedHR, setIsCompletedHR] = useState(true);
  const [isLineActive, setIsLineActive] = useState(false);
  const [isLineActiveTwo, setIsLineActiveTwo] = useState(false);

  // const [intialState, setIntialSate]  = useState(true);

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

  // alert(referralId);
  // console.log("complete data of Referral", referral);

  useEffect(() => {
    const rounds = referral.interviewRounds;
    console.log("rounds", rounds);

    if (!(rounds?.length > 0)) {
      console.log("No interview rounds available");
      setIsCompletedGD(false);
      setIsCompletedTA(false);
      setIsCompletedHR(false);
      setIsLineActive(false);
      setIsLineActiveTwo(false);
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

    console.log("GD status present:", hasCompletedGD);
    console.log("TA status present:", hasCompletedTA);
    console.log("HR status present:", hasCompletedHR);

    setIsCompletedGD(hasCompletedGD);
    setIsCompletedTA(hasCompletedTA);
    setIsCompletedHR(hasCompletedHR);

    setIsLineActive(true);
    setIsLineActiveTwo(true);
  }, [referral.interviewRounds]);

  // if (fetchInterViewRoundObj)
  const dateInterview = new Date(referral.roundDate);
  const accessToRatingsForm = dateInterview.toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  useEffect(() => {
    const currentSatus = referral.status;
    const mailSent = referral.mailStatus;
    console.log("currentStatus", currentSatus);
    console.log("mailSent", mailSent);
    if (referral?.roundDate) {
      // alert("are you com here")
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
      } else if (accessToRatingsForm === today) {
        setPermissionToRatingsForm("");
        const shouldDisable =
          referral.interviewResult === "Pending" ? false : true;
        setIsDisabled(shouldDisable);
      } else {
        setPermissionToRatingsForm("");
        const shouldDisable =
          referral.interviewResult === "Pending" ? false : true;
        setIsDisabled(shouldDisable);
      }
    } else if (currentSatus === "Selected" && mailSent === "Not Sent") {
      // alert("here");
      setPermissionToRatingsForm(
        "Candidate selected — offer letter not yet sent."
      );
      setIsDisabled(true);
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

  const getBackgroundColor = (round) => {
    const currentStatusIndex = stages.indexOf(referral.status);
    const dateInterview = new Date(referral.roundDate);
    const accessToRatingsForm = dateInterview.toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];
    if (round === activeStage) return "#1976d2"; // blue for active
    if (round < currentStatusIndex) {
      return "#28a745"; // green for completed
    }
    return "grey";
  };

  const nextStageIndex =
    activeStage !== null && activeStage < stages.length - 1
      ? activeStage + 1
      : null;

  // console.log(nextStageIndex)
  const nextStageName = stages[activeStage + 1];
  const currentStageIndex = stages.indexOf(referral.status);
  // console.log("current stage index", currentStageIndex);
  // console.log("check the condition gd",  currentStageIndex >= 1)
  // console.log("check the condition technical",  currentStageIndex >= 2)
  // console.log("check the condition hr",  currentStageIndex >= 3)

  const handleFormClick = (round) => {
    // console.log(round, "round clicked");
    const allRounds = referral.interviewRounds[round - 1]["status"];
    console.log(allRounds);
    if (round >= 0 && round < stages.length) {
      if (round === 1) {
        if (referral.status === "Submitted" && referral.mailStatus !== "Sent") {
          console.log(
            "Cannot proceed to Group Discussion because mailStatus is not Sent and status is Submitted"
          );

          return;
        }
        console.log("Selected GD:", selectedStage);
        console.log(
          "Selected GD:",
          stages[round] === "Group Discussion" && allRounds === "Completed"
        );

        if (stages[round] === "Group Discussion" && allRounds) {
          // alert("here");
          setIsCompletedGD(false);
          setIsCompletedTA(false);
          setIsCompletedHR(false);
          setIsDisabled(true);
        } else if (allRounds === null) {
          // alert("here");
          setIsCompletedGD(false);
          setIsCompletedTA(false);
          setIsCompletedHR(false);
          // setIsDisabled(true);
        }

        setActiveStage(round);
        setSelectedStage(stages[round]);
      } else if (round === 2) {
        if (stages[round] === "Technical Assessment" && allRounds) {
          setIsCompletedGD(true);
          setIsCompletedTA(false);
          setIsCompletedHR(false);
          setIsDisabled(true);
          setIsLineActive(true);
        } else if (allRounds === null) {
          setIsCompletedGD(true);
          setIsCompletedTA(false);
          setIsCompletedHR(false);
          setIsDisabled(true);
        }
        if (
          referral.mailStatus === "Sent" &&
          referral.status === "Technical Assessment"
        ) {
          setIsDisabled(false);
          setActiveStage(round);
          setSelectedStage(stages[round]);
          setIsCompletedGD(true);
        } else {
          // alert("else")
          setActiveStage(round);
          setSelectedStage(stages[round]);
          //  setActiveStage(round);
        }
      } else if (round === 3) {
        // alert("3");

        if (stages[round] === "HR Round" && allRounds) {
          setIsCompletedGD(false);
          setIsCompletedTA(false);
          setIsCompletedHR(false);
          setIsDisabled(true);
        } else if (allRounds === null && referral.mailStatus === "Sent") {
          setIsCompletedGD(false);
          setIsCompletedTA(false);
          setIsCompletedHR(false);
          setIsDisabled(true);
        }

        if (
          (referral.mailStatus === "Not Sent" &&
            referral.status === "HR Round") ||
          referral.status === "Selected"
        ) {
          // alert("coming here");
          setActiveStage(round);
          setSelectedStage(stages[round]);
        } else if (
          referral.mailStatus === "Sent" &&
          referral.status === "HR Round"
        ) {
          // alert("coming here2");
          setIsDisabled(false);
          setActiveStage(round);
          setSelectedStage(stages[round]);
        } else {
          // alert("else");
          setIsDisabled(true);

          setActiveStage(round);
          setSelectedStage(stages[round]);
          //  setActiveStage(round);
        }
        setIsCompletedHR(false);
        setIsCompletedGD(true);
        setIsCompletedTA(true);
      } else if (round === 4) {
        // alert("4")

        if (
          referral.mailStatus === "Not Sent" &&
          referral.status === "Selected"
        ) {
          setActiveStage(round);
          setSelectedStage(stages[round]);
        } else if (referral.mailStatus === "Sent") {
          setActiveStage(round);
          setSelectedStage(stages[round]);
        }
      } else {
        // alert("yes coming hee");
        setActiveStage(round);
        setSelectedStage(stages[round]);
      }
    }
    // console.log("Selected stage set to:", stages[round]);
  };

  // setSelectedStage(stages[round]);

  const handleRadioChange = (e) => {
    setIsDisabledSubmitBtn(false);
    setFinalValue(e.target.value);
  };

  const handleInputChange = (e) => {
    setIsDisabledSubmitBtn(false);
    setFinalValue(e.target.value);
  };

  const integerPart = Math.floor(parseFloat(finalValue)) || null;
  // console.log("ineger part", integerPart);

  const getRate = async (e) => {
    e.preventDefault();
    if (!finalValue || !isFeedback) {
      setError("Enter the rating and feedback!");
      return;
    }
    const rating = parseFloat(finalValue);
    console.log("get rate", rating);

    if (isNaN(rating) || rating < 1 || rating > 10) {
      setError("Rating must be a number between 1 and 10");
      return;
    }
    let updatedStageName = nextStageName;
    console.log("UPDATESTAGENAME", updatedStageName);
    // alert("update", updatedStageName);
    let rejectedIn = null;

    if (rating < 6) {
      // setInfo("Ratings with less than 6 the candidate is rejected!");
      updatedStageName = "Rejected";
      // rejectedIn = nextStageName;
      rejectedIn = referral.status;
    }
    const data = {
      finalValue,
      isFeedback,
      referralId: referral._id,
      status: referral.status,
      userIdAccess,
      nextStageName: updatedStageName,
      rejectedIn,
    };

    const stage = activeStage;
    console.log("stage", stage);
    console.log("Submitted data:", data);
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/referral/round`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log(response);
      if (response.ok) {
        toast.success("Rating Successful");
        closeModal();
        fetchCurrent();
        fetchCurrentTable();
        console.log("hello");
      } else {
        toast.error("Rating Unsuccessful");
      }
    } catch (error) {
      console.log(error.name);
      console.log(error.message);
    }
  };
  const referralStatusIndex = stages.indexOf(referral.status);

  useEffect(() => {
    console.log("Fetching for:", referral._id, selectedStage);
    if (!selectedStage || !referral?._id) return;
    // alert("selected stage", selectedStage);
    //  alert("referral id", )
    // console.log("SELECTED STAGE", selectedStage);
    // console.log("REFERRAL ID", referral._id);

    const fetchRatings = async () => {
      setError("");
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/referral/ratings/${referral._id}/${selectedStage}`
        );

        console.log(
          `http://localhost:3000/api/v1/referral/ratings/${referral._id}/${selectedStage}`
        );

        const data = await response.json();
        // console.log("data", data);
        if (response.ok) {
          // setPrevData(data);
          setPrevData(data[0] || {});
        }
        // console.log("prevdata", prevData);
      } catch (error) {
        console.error("Error fetching ratings", error);
      }
    };

    fetchRatings();
  }, [referral, selectedStage, referral._id]);

  // useEffect(() => {
  //   if (!selectedStage || !referral?._id) return;

  //   const fetchRatings = async () => {
  //     setError("");

  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/api/v1/referral/ratings/${referral._id}/${selectedStage}`
  //       );

  //       const data = await response.json();
  //       console.log("Fetched Ratings:", data);

  //       if (response.ok && Array.isArray(data)) {
  //         const filtered = data.filter(
  //           (item) =>
  //             item.nextStatus === selectedStage ||
  //             item.rejectedIn === selectedStage
  //         );

  //         setPrevData(filtered[0] || {});
  //         console.log("Filtered Data:", filtered[0] || {});
  //       } else {
  //         setPrevData({});
  //         console.warn("No ratings found for stage:", selectedStage);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching ratings:", error);
  //     }
  //   };

  //   fetchRatings();
  // }, [referral?._id, selectedStage]);

  useEffect(() => {
    if (prevData) {
      console.log("previousData 278", prevData);
      setFeedback(prevData.feedback ?? "");
      setFinalValue(prevData.finalRating ?? "");
    } else {
      setFeedback("");
      setFinalValue("");
    }
  }, [prevData]);

  // const isDisabled = activeStage <= referralStatusIndex;
  // console.log("actvestage", activeStage);
  // console.log("referralStatusIndex", referralStatusIndex);
  // console.log("ActiveStage", activeStage);
  // console.log("referralStatusIndex", referralStatusIndex);
  // console.log(isDisabled);
  // console.log("activeStage", referral);

  // useEffect(() => {
  //   const fetchRatings = async () => {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/api/v1/referral/ratings/${referral._id}`
  //       );
  //       const result = await response.json();

  //       if (result.success) {
  //         setDataInterviewProcess(result.data);
  //         console.log("Ratings data updated:", result.data);
  //       } else {
  //         console.warn("No ratings found.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching ratings:", error);
  //     }
  //   };

  //   fetchRatings();
  // }, [referral._id]); //run only when referral ID changes

  const normalizedData = Array.isArray(dataInterviewProcess)
    ? dataInterviewProcess
    : [dataInterviewProcess];

  const formatted = normalizedData.map((item) => ({
    name: referral.name,
    round: item.nextStatus,
    rejectedIn: item.rejectedIn || null,
  }));
  const rejectedIndex =
    referral.status === "Rejected" ? stages.indexOf(referral.rejectedIn) : -1;
  // console.log("RESULT", formatted);
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
  
  const renderFormContent = (referral) => {
    // alert("from switch", activeStage);
    // console.log("inform", isDisabled);

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
                          style={{ color: isTheme ? "white" : "black" }}
                          readOnly={isDisabled}
                          value={
                            prevData &&
                            typeof prevData.finalRating !== "undefined"
                              ? prevData.finalRating
                              : finalValue || ""
                          }
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
                    style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
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
                    // onClick={
                    //   currentStageIndex >= 1 ? () => handleFormClick(2) : null
                    // }
                    // style={{
                    //   cursor:
                    //     currentStageIndex >= 1 ? "pointer" : "not-allowed",
                    // }}
                  />
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  style={{border: isTheme ? "1px solid #ffc300":"1px solid #283e46"}}
                  disabled={isDisbledSubmitBtn}
                  // disabled={activeStage = referralStatusIndex}
                  // disabled={isDisabled}
                >
                  <span className="submit_btn submit_icon_align"></span>
                  Submit
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
                  <p>Ratinng</p>
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

                      {/* <div>
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
                                onChange={handleRadioChange}
                                // checked={finalValue === num.toString()}
                                checked={integerPart === num}
                              />
                              {num}
                            </label>
                          ))}
                        </div>
                      </div> */}
                      <div className="current-rate">
                        <label htmlFor="finalInput">Final</label>
                        <input
                          type="text"
                          id="finalInput"
                          style={{ color: isTheme ? "white" : "black" }}
                          readOnly={isDisabled}
                          value={
                            prevData &&
                            typeof prevData.finalRating !== "undefined"
                              ? prevData.finalRating
                              : finalValue || ""
                          }
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
                    style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
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
                    // onClick={
                    //   currentStageIndex >= 1 ? () => handleFormClick(1) : null
                    // }
                    // style={{
                    //   cursor:
                    //     currentStageIndex >= 1 ? "pointer" : "not-allowed",
                    // }}
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
                    // onClick={
                    //   currentStageIndex >= 2 ? () => handleFormClick(3) : null
                    // }
                    // style={{
                    //   cursor:
                    //     currentStageIndex >= 2 ? "pointer" : "not-allowed",
                    // }}
                  />
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  style={{border: isTheme ? "1px solid #ffc300":"1px solid #283e46"}}
                  // disabled={activeStage <= referralStatusIndex}
                  disabled={isDisabled}
                >
                  <span className="submit_btn submit_icon_align"></span>
                  Submit
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
              <h1 className="roundName">HR Round Rating </h1>
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
                          id="finalInput"
                          style={{ color: isTheme ? "white" : "black" }}
                          readOnly={isDisabled}
                          value={
                            prevData &&
                            typeof prevData.finalRating !== "undefined"
                              ? prevData.finalRating
                              : finalValue || ""
                          }
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
                    style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
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
              <div className="submitSection-round">
                    <div className="prev-next-img">
                  <img
                    src="./src/assets/images/downward-svgrepo-com.svg"
                    width={45}
                    alt=""
                    // onClick={
                    //   currentStageIndex >= 2 ? () => handleFormClick(2) : null
                    // }
                    // style={{
                    //   cursor:
                    //     currentStageIndex >= 2 ? "pointer" : "not-allowed",
                    // }}
                    onClick={canClick(2) ? () => handleFormClick(2) : null}
                    style={{
                      cursor: canClick(2) ? "pointer" : "not-allowed",
                    }}
                  />
                  <span className="count-page">{activeStage}</span>
                  {/* <img
                    src="./src/assets/images/next-svgrepo-com(1).svg"
                    width={45}
                    alt=""
                    onClick={
                      currentStageIndex >= 3 ? () => handleFormClick(4) : null
                    }
                    style={{
                      cursor:
                        currentStageIndex >= 3 ? "pointer" : "not-allowed",
                    }}
                  /> */}
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  style={{border: isTheme ? "1px solid #ffc300":"1px solid #283e46"}}
                  // disabled={activeStage <= referralStatusIndex}
                  disabled={isDisabled}
                >
                  <span className="submit_btn submit_icon_align"></span>
                  Submit
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
                          id="finalInput"
                          style={{ color: isTheme ? "white" : "black" }}
                          value={
                            prevData &&
                            typeof prevData.finalRating !== "undefined"
                              ? prevData.finalRating
                              : finalValue || ""
                          }
                          readOnly={isDisabled}
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
                    style={{ backgroundColor: isTheme ? "#6c757d" : "white" }}
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
              <div className="submitSection-round">
                  <div className="prev-next-img">
                  <img
                    src="./src/assets/images/downward-svgrepo-com.svg"
                    width={45}
                    alt=""
                    onClick={
                      currentStageIndex >= 3 ? () => handleFormClick(3) : null
                    }
                    style={{
                      cursor:
                        currentStageIndex >= 3 ? "pointer" : "not-allowed",
                    }}
                  />
                  <span className="count-page">{activeStage}</span>
                </div>
                <button
                  type="submit"
                  className="submitButton"
                  style={{border: isTheme ? "1px solid #ffc300":"1px solid #283e46"}}
                  // disabled={stages[activeStage] === referral.status}
                  // disabled={activeStage <= referralStatusIndex}
                  disabled={isDisabled}
                >
                  <span className="submit_btn submit_icon_align"></span>
                  Submit
                </button>
              
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
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
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Rate {referral.referral_fname} {referral.referral_lname}
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
                // onClick={
                //   currentStageIndex >= 1 ? () => handleFormClick(1) : null
                // }
                style={{
                  // cursor: currentStageIndex >= 1 ? "pointer" : "not-allowed",
                  // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="Group Discussion"
              >
                <div className="round_one_div">
                  <span
                    onClick={
                      currentStageIndex >= 1 ? () => handleFormClick(1) : null
                    }
                    style={{
                      cursor:
                        currentStageIndex >= 1 ? "pointer" : "not-allowed",
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
                    } ${activeStage === 1 ? "clickedRate" : ""}`}
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
                  {/* <hr className="line" /> */}
                  <hr
                    className={`${
                      isCompletedGD === true ? "activeLine" : "line"
                    }`}
                    // className={`${
                    //   isLineActive === true ? "activeLine" : "line"
                    // }`}
                  />
                </div>
              </div>
            </div>
            <div className="round-one">
              <div
                className="round-section"
                // onClick={
                //   currentStageIndex >= 2 ? () => handleFormClick(2) : null
                //   // currentStageIndex >= 1 ? () => null : handleFormClick(2)
                // }
                style={{
                  // cursor: currentStageIndex >= 2 ? "pointer" : "not-allowed",
                  // cursor: currentStageIndex >= 1 ? "not-allowed" : "pointer",
                  // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="Technical Assessment"
              >
                <div className="round_one_div">
                  <span
                    onClick={
                      currentStageIndex >= 2 ? () => handleFormClick(2) : null
                      // currentStageIndex >= 1 ? () => null : handleFormClick(2)
                    }
                    style={{
                      cursor:
                        currentStageIndex >= 2 ? "pointer" : "not-allowed",
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
                    } ${activeStage === 2 ? "clickedRate" : ""}`}
                  >
                    Technical Assessment
                  </span>
                </div>
                <div>
                  {/* <hr className="lineAfterTechnical" /> */}
                  <hr
                    className={` 
                     ${
                       isCompletedTA === true
                         ? "activeLineTwo"
                         : "lineAfterTechnical"
                     }`}
                    // className={`

                    //   ${
                    //   isLineActiveTwo === true
                    //     ? "activeLineTwo"
                    //     : "lineAfterTechnical"
                    // }
                    //  ${
                    //   isCompletedTA === true ? "lineAfterTechnical" : "activeLineTwo"
                    // }`}
                  />
                </div>

                {/* <img
                  src={
                    isTheme
                      ? "./src/assets/images/tech-assessment-dark.svg"
                      : "./src/assets/images/tech-assessment.svg"
                  }
                  width={30}
                  alt=""
                /> */}
              </div>
            </div>

            <div className="round-one">
              <div
                // className="round-section"
                // onClick={
                //   currentStageIndex >= 3 ? () => handleFormClick(3) : null
                // }
                style={{
                  // cursor: currentStageIndex >= 3 ? "pointer" : "not-allowed",
                  // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="HR Round"
              >
                <div className="round_one_div">
                  <span
                    onClick={
                      currentStageIndex >= 3 ? () => handleFormClick(3) : null
                    }
                    style={{
                      cursor:
                        currentStageIndex >= 3 ? "pointer" : "not-allowed",
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
                    } ${activeStage === 3 ? "clickedRate" : ""}`}
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
                margin: "0 0.2em",
              }}
            >
              <hr
                className="animation_line"
                style={{
                  border:
                    getBackgroundColor(3) === "#28a745"
                      ? "1px solid #28a745"
                      : "1px solid #6c757d",
                }}
              />
            </div> */}
            {/* <div className="round-one">
              <div
                className="round-section"
                onClick={
                  currentStageIndex >= 3 ? () => handleFormClick(4) : null
                }
                style={{
                  cursor: currentStageIndex >= 3 ? "pointer" : "not-allowed",
                  border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  animationDelay: "0.1s",
                  animationPlayState: "running",
                }}
                title="Selected"
              >
                <div className="round_one_div">
                  <span
                    className={`formOne 
               ${activeStage === 4 ? "active" : ""} 
                ${
                  referral.status === "Rejected" &&
                  referral.rejectedIn === "Selected"
                    ? ""
                    : formatted.some(
                        (item) =>
                          item.round === "Rejected" &&
                          item.rejectedIn === "Selected"
                      )
                    ? "noBg"
                    : formatted.some(
                        (item) =>
                          item.round === "Selected" && item.rejectedIn === null
                      )
                    ? "greenBg"
                    : "noBg"
                }`}
                  >
                    
                    {activeStage !== 4 &&
                    formatted.some(
                      (item) =>
                        item.round === "Selected" && item.rejectedIn === null
                    ) ? (
                      <img
                        src={completeRating}
                        alt="Completed"
                        style={{ width: 24, height: 24 }}
                      />
                    ) : (
                      "4"
                    )}
                  </span>

                  <span
                    className={`rounds 
              ${
                referral?.status === "Rejected" &&
                referral?.rejectedIn === "Selected"
                  ? "rejected"
                  : referral?.status !== "Rejected" &&
                    getBackgroundColor(4) === "#28a745"
                  ? "completed"
                  : ""
              }
              ${activeStage === 4 ? "active" : ""}
              ${
                activeStage !== 4 &&
                formatted.some(
                  (item) =>
                    item.round === "Selected" && item.rejectedIn === null
                )
                  ? "completed"
                  : ""
              }
            `}
                  >
                    Selected
                  </span>
                </div>

               
              </div>
            </div> */}
          </div>
          {renderFormContent(referral)}
        </div>
      </div>
    </div>
  );
};

export default RateReferral;
