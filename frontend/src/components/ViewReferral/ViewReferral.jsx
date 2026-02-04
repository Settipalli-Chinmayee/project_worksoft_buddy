import { useContext, useEffect, useMemo, useState } from "react";
import "./viewReferral.css";
import Current from "../Current/Current";
import breadCrumbs from "../../assets/images/breadcrumbs-svgrepo-com.svg";
// import groupDiscussion from "../../assets/images/groupDiscussion.svg";
import selected from "../../assets/images/selected.svg";
import hr from "../../assets/images/hr.svg";
import techAssessment from "../../assets/images/tech-assessment.svg";
import mailStatus from "../../assets/images/mailStatus.svg";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import groupDiscussion from "../../assets/images/new_gd_inactive.svg";
import groupDiscussionActive from "../../assets/images/new_gd_active.svg"; //for completed rounds
import groupDiscussionCompleted from "../../assets/images/new_gd_completed.svg"; // when you click
import technical from "../../assets/images/new_ta_inactive.svg";
import technicalActive from "../../assets/images/new_ta_active.svg";
import technicalCompleted from "../../assets/images/new_ta_completed.svg";
import hrRound from "../../assets/images/new_hr_inactive.svg";
import hrRoundActive from "../../assets/images/new_hr_active.svg";
import hrRoundCompleted from "../../assets/images/new_hr_complete.svg";
import DataTable from "react-data-table-component";
import ViewReferralTable from "../ViewReferralTable/ViewReferralTable";
import ReferralStatus from "../ReferralStatus/ReferralStatus";
import MailIcon from "../../assets/images/mailIcon.svg";
import MailDarkIcon from "../../assets/images/mailDarkIcon.svg";

const ViewReferral = ({ referral, goBackToAllReferrals, backToCurrent }) => {
  // console.log("coming from emailed", referral);
  const [activeForm, setActiveForm] = useState(null);
  const [isStatus, setStatus] = useState(1);
  const [usersWithAvatars, setUsersWithAvatars] = useState([]);
  // console.log("backtoCurrent", backToCurrent);
  const { isTheme } = useContext(ThemeContext);
  const [isDetails, setDetails] = useState(null);
  const [isRated, setRatedBy] = useState("");
  const [updatedBy, setUpdatedBy] = useState([]);
  const [isDrop, setDrop] = useState(false);
  const [isCompletedGD, setIsCompletedGD] = useState(true);
  const [isCompletedTA, setIsCompletedTA] = useState(true);
  const [isCompletedHR, setIsCompletedHR] = useState(true);
  const [activeStage, setActiveStage] = useState();
  const [showContent, setShowContent] = useState(false);
  const [isLineActive, setIsLineActive] = useState(false);
  const [isLineActiveTwo, setIsLineActiveTwo] = useState(false);

  useEffect(() => {
    setShowContent(false);
    const timeout = setTimeout(() => setShowContent(true), 50); // allow unmount & re-entry
    return () => clearTimeout(timeout);
  }, [activeForm]); // or any stage change like activeStage

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
  const formatDate = (dateFormatValue) => {
    const date = new Date(dateFormatValue);
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const formattedDate = formatDate(referral.roundDate);
    console.log("Formatted Date:", formattedDate);
  }, [referral.roundDate]);
  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const usersWithAvatars = await Promise.all(
          [referral].map(async (referral) => {
            const initials =
              referral.referral_fname[0] + referral.referral_lname[0];
            // console.log(initials);
            try {
              const darkAvatarColors = [
                "780000",
                "c1121f",
                "003049",
                "219ebc",
                "880E4F",
                "005f73",
                "bb3e03",
                "ae2012",
                "9b2226",
                "03045e",
                "023e8a",
                "3a5a40",
                "6f1d1b",
                "450920",
                "5e548e",
                "15616d",
                "00509d",
                "003f88",
                "a4133c",
                "d8572a",
                "390099",
                "7b2cbf",
                "1d4e89",
                "3d5a80",
              ];

              const response = await fetch(
                `https://api.dicebear.com/9.x/initials/svg?seed=${initials}&backgroundColor=${backgroundColorParam}&textColor=ffffff&radius=50&fontSize=44&fontWeight=700`
              );
              const svgText = await response.text();
              const avatarUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
                svgText
              )}`;
              return { ...referral, avatarUrl };
            } catch (err) {
              console.error("Error fetching avatar for user", referral, err);
              return referral;
            }
          })
        );
        setUsersWithAvatars(usersWithAvatars);
      } catch (err) {
        console.error("Error fetching avatars", err);
      }
    };

    fetchAvatars();
  }, [referral]);

  const stages = [
    "Submitted",
    "Group Discussion",
    "Technical Assessment",
    "HR Round",
    "Selected",
  ];

  // console.log(referral._id, "Referral ids in view to fetch round one date");

  const getBackgroundColor = (round) => {
    const currentStatusIndex = stages.indexOf(referral.status);

    if (round <= currentStatusIndex) {
      return "#C0F8D0";
    }
    return "transparent";
  };

  const handleFormClick = (formIndex) => {
    // alert(formIndex);
    setActiveForm(formIndex);
    setActiveStage(formIndex);
    console.log("STAGES", stages[formIndex]);
    if (stages[formIndex] === "Group Discussion") {
      setIsCompletedGD(false);
      setIsCompletedTA(false);
      setIsCompletedHR(false);
    } else if (stages[formIndex] === "Technical Assessment") {
      setIsCompletedGD(true);
      setIsCompletedTA(false);
      setIsCompletedHR(false);
    } else if (stages[formIndex] === "HR Round") {
      setIsCompletedGD(true);
      setIsCompletedTA(true);
      setIsCompletedHR(false);
    }
  };

  const fetchData = async (stage, id) => {
    console.log("STage", stage);
    console.log("id", id);
    try {
      const result = await fetch(
        `http://localhost:3000/api/v1/referral/rate/${stage}/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`http://localhost:3000/api/v1/referral/rate/${stage}/${id}`);
      const data = await result.json();
      // console.log(data);
      setDetails(data.data);
      console.log(data.data, "data.data");
      setRatedBy(data.ratedBy);
      setUpdatedBy(data.updatedBy);
    } catch (error) {
      console.error("Error fetching stage details:", error);
      setDetails(null);
      setRatedBy("");
      setUpdatedBy(null);
    }
  };

  const dropDown = () => {
    // setDrop(true);
    // console.log("arrow clicked");
    setDrop((prevDrop) => !prevDrop);
  };

  const renderFormContent = () => {
    // console.log(referral, "referral");
    switch (activeForm) {
      // case 1:
      //   return (
      //     <div>
      //       <p style={{ color: isTheme ? "white" : "black" }}>Mail Data</p>
      //     </div>
      //   );
      case 1:
        return (
          <div
          // style={{ color: isTheme ? "white" : "black" }}
          >
            <div className="final">
              <div
                className="final_rating"
                // style={{
                //   border: isTheme ? "1px solid white" : "1px solid gray",
                // }}
              >
                <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Final Rating</p>
                {/* <div className={`rating-fade ${showContent ? "visible" : ""}`}> */}

                <div className="rateby">
                  <div
                    className="rating_Section"
                    // style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Rating
                    </p>
                    {isDetails?.finalRating ? (
                      <p
                        className={
                          isDetails?.finalRating > 6
                            ? "moreThanSix"
                            : "lessThanSix"
                        }
                      >
                        {isDetails?.finalRating}
                        {/* {isDetails?.finalRating || "Yet to give ratings."} */}
                      </p>
                    ) : (
                      <h1 className="noValues">Not yet rated</h1>
                    )}
                  </div>
                  <div
                    className="rating_Section"
                    // style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Rated By
                    </p>

                    {isRated ? (
                      <>
                        <p className="capitalizeNames" style={{color:isTheme?"#cccccc":"#112a46"}}>{isRated}</p>
                      </>
                    ) : (
                      <h1 className="noValues">N/A</h1>
                    )}

                    {/* <p>{isRated || "No rating submitted yet"}</p> */}
                  </div>
                  <div
                    className="rating_Section feedback"
                    //   style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Feedback
                    </p>

                    {isDetails?.feedback ? (
                      <>
                        <p className="content" style={{color:isTheme?"#cccccc":"#112a46"}}>
                          {isDetails?.feedback}
                          {/* {isDetails?.feedback || "No feedback provided"} */}
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="noValues">No feedback provided</h1>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="final">
                <div
                  className="final_rating "
                  // style={{
                  //   border: isTheme ? "1px solid white" : "1px solid gray",
                  // }}
                >
                  {/* <div className="final"></div> */}
                  <div className="drop-down">
                    <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Review Details</p>
                    <div
                    // style={{
                    //   // borderRadius: "50%",
                    //   backgroundColor: isTheme ? "#495057" : "",
                    // }}
                    >
                      {/* <img
                        className="dropdown-img"
                        style={{ top: isDrop ? "0px" : "1px" }}
                        src={
                          isDrop
                            ? isTheme
                              ? "./src/assets/images/downarrow-dark.svg"
                              : "./src/assets/images/dropuparrow-dark.svg"
                            : isTheme
                            ? "./src/assets/images/dropdown-dark.svg"
                            : "./src/assets/images/dropdown.svg"
                        }
                        // src={isTheme ?}
                        width={24}
                        alt=""
                        onClick={() => dropDown()}
                      /> */}
                      {isDetails?.updateDetails?.length > 0 ? (
                        <ViewReferralTable
                          detailsToDisplay={isDetails}
                          updatedBy={updatedBy}
                          themeDetails={isTheme}
                        />
                      ) : (
                        <>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                              color: "#7d7c83",
                            }}
                          >
                            {/* <img
                              src="/no-data-icon.svg"
                              alt="No Data"
                              style={{ width: "80px", opacity: 0.6 }}
                            /> */}
                            <h1>No updates recorded yet</h1>
                            {/* <p>
                              Any updates about this candidate’s process will be
                              shown here.
                            </p> */}
                          </div>
                        </>
                      )}
                      {/* {isDetails?.updateDetails?.length > 0 && (
                        <ViewReferralTable
                          detailsToDisplay={isDetails}
                          updatedBy={updatedBy}
                          themeDetails={isTheme}
                        />
                      )} */}
                    </div>
                  </div>

                  {/* {isDrop ? (
                    <div className="final-height">
                      {isDetails?.updateDetails &&
                      updatedBy &&
                      isDetails.updateDetails.length > 0 ? (
                        <ul style={{ color: isTheme ? "white" : "black" }}>
                          {isDetails.updateDetails.map((detail, index) => (
                            <li
                              key={detail._id}
                              className="final_rating"
                              style={{
                                width: "37em",
                                border: isTheme
                                  ? "1px solid white"
                                  : "1px solid gray",
                              }}
                            >
                              <div className="rateby">
                                <div>
                                  <strong>Updated By:</strong>{" "}
                                  {updatedBy && updatedBy[index]
                                    ? updatedBy[index]
                                    : "Unknown"}
                                </div>
                                <div>
                                  <strong>Updated At:</strong>{" "}
                                  {new Date(detail.updatedAt).toLocaleString()}
                                </div>
                              </div>
                              <strong>Reason:</strong> {detail.isReason} <br />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not Updated!</p>
                      )}
                    </div>
                  ) : null} */}
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        // console.log(isDetails,"TA details")
        return (
          <div
          // style={{ color: isTheme ? "white" : "black" }}
          >
            <div className="final">
              <div
                className="final_rating"
                // style={{
                //   border: isTheme ? "1px solid white" : "1px solid gray",
                // }}
              >
                <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Final Rating</p>
                {/* <div className={`rating-fade ${showContent ? "visible" : ""}`}> */}

                <div className="rateby">
                  <div
                    className="rating_Section"
                    // style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Rating
                    </p>
                    {isDetails?.finalRating ? (
                      <p
                        className={
                          isDetails?.finalRating > 6
                            ? "moreThanSix"
                            : "lessThanSix"
                        }
                      >
                        {isDetails?.finalRating}
                        {/* {isDetails?.finalRating || "Yet to give ratings."} */}
                      </p>
                    ) : (
                      <h1 className="noValues">Not yet rated</h1>
                    )}
                  </div>
                  <div
                    className="rating_Section"
                    // style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Rated By
                    </p>

                    {isRated ? (
                      <>
                        <p className="capitalizeNames" style={{color:isTheme?"#cccccc":"#112a46"}}>{isRated}</p>
                      </>
                    ) : (
                      <h1 className="noValues">N/A</h1>
                    )}

                    {/* <p>{isRated || "No rating submitted yet"}</p> */}
                  </div>
                  <div
                    className="rating_Section feedback"
                    //   style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Feedback
                    </p>

                    {isDetails?.feedback ? (
                      <>
                        <p className="content" style={{color:isTheme?"#cccccc":"#112a46"}}>
                          {isDetails?.feedback}
                          {/* {isDetails?.feedback || "No feedback provided"} */}
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="noValues">No feedback provided</h1>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="final">
                <div
                  className="final_rating "
                  // style={{
                  //   border: isTheme ? "1px solid white" : "1px solid gray",
                  // }}
                >
                  {/* <div className="final"></div> */}
                  <div className="drop-down">
                    <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Review Details</p>
                    <div
                    // style={{
                    //   // borderRadius: "50%",
                    //   backgroundColor: isTheme ? "#495057" : "",
                    // }}
                    >
                      {/* <img
                        className="dropdown-img"
                        style={{ top: isDrop ? "0px" : "1px" }}
                        src={
                          isDrop
                            ? isTheme
                              ? "./src/assets/images/downarrow-dark.svg"
                              : "./src/assets/images/dropuparrow-dark.svg"
                            : isTheme
                            ? "./src/assets/images/dropdown-dark.svg"
                            : "./src/assets/images/dropdown.svg"
                        }
                        // src={isTheme ?}
                        width={24}
                        alt=""
                        onClick={() => dropDown()}
                      /> */}
                      {isDetails?.updateDetails?.length > 0 ? (
                        <ViewReferralTable
                          detailsToDisplay={isDetails}
                          updatedBy={updatedBy}
                          themeDetails={isTheme}
                        />
                      ) : (
                        <>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                              color: "#7d7c83",
                            }}
                          >
                            {/* <img
                              src="/no-data-icon.svg"
                              alt="No Data"
                              style={{ width: "80px", opacity: 0.6 }}
                            /> */}
                            <h1>No updates recorded yet</h1>
                            {/* <p>
                              Any updates about this candidate’s process will be
                              shown here.
                            </p> */}
                          </div>
                        </>
                      )}
                      {/* {isDetails?.updateDetails?.length > 0 && (
                        <ViewReferralTable
                          detailsToDisplay={isDetails}
                          updatedBy={updatedBy}
                          themeDetails={isTheme}
                        />
                      )} */}
                    </div>
                  </div>

                  {/* {isDrop ? (
                    <div className="final-height">
                      {isDetails?.updateDetails &&
                      updatedBy &&
                      isDetails.updateDetails.length > 0 ? (
                        <ul style={{ color: isTheme ? "white" : "black" }}>
                          {isDetails.updateDetails.map((detail, index) => (
                            <li
                              key={detail._id}
                              className="final_rating"
                              style={{
                                width: "37em",
                                border: isTheme
                                  ? "1px solid white"
                                  : "1px solid gray",
                              }}
                            >
                              <div className="rateby">
                                <div>
                                  <strong>Updated By:</strong>{" "}
                                  {updatedBy && updatedBy[index]
                                    ? updatedBy[index]
                                    : "Unknown"}
                                </div>
                                <div>
                                  <strong>Updated At:</strong>{" "}
                                  {new Date(detail.updatedAt).toLocaleString()}
                                </div>
                              </div>
                              <strong>Reason:</strong> {detail.isReason} <br />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not Updated!</p>
                      )}
                    </div>
                  ) : null} */}
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        // alert(isDetails, "hr details");
        return (
          <div
          // style={{ color: isTheme ? "white" : "black" }}
          >
            <div className="final">
              <div
                className="final_rating"
                // style={{
                //   border: isTheme ? "1px solid white" : "1px solid gray",
                // }}
              >
                <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Final Rating</p>
                {/* <div className={`rating-fade ${showContent ? "visible" : ""}`}> */}

                <div className="rateby">
                  <div
                    className="rating_Section"
                    // style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Rating
                    </p>
                    {isDetails?.finalRating ? (
                      <p
                        className={
                          isDetails?.finalRating > 6
                            ? "moreThanSix"
                            : "lessThanSix"
                        }
                      >
                        {isDetails?.finalRating}
                        {/* {isDetails?.finalRating || "Yet to give ratings."} */}
                      </p>
                    ) : (
                      <h1 className="noValues">Not yet rated</h1>
                    )}
                  </div>
                  <div
                    className="rating_Section"
                    // style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Rated By
                    </p>

                    {isRated ? (
                      <>
                        <p className="capitalizeNames" style={{color:isTheme?"#cccccc":"#112a46"}}>{isRated}</p>
                      </>
                    ) : (
                      <h1 className="noValues">N/A</h1>
                    )}

                    {/* <p>{isRated || "No rating submitted yet"}</p> */}
                  </div>
                  <div
                    className="rating_Section feedback"
                    //   style={{
                    //   backgroundColor: isTheme ? "#383737" : "#F7F7F7",
                    // }}
                  >
                    <p
                      style={{
                        color: isTheme ? "white" : "#283E46",
                      }}
                      className="subHeadingsView"
                    >
                      Feedback
                    </p>

                    {isDetails?.feedback ? (
                      <>
                        <p className="content" style={{color:isTheme?"#cccccc":"#112a46"}}>
                          {isDetails?.feedback}
                          {/* {isDetails?.feedback || "No feedback provided"} */}
                        </p>
                      </>
                    ) : (
                      <>
                        <h1 className="noValues">No feedback provided</h1>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="final">
                <div
                  className="final_rating "
                  // style={{
                  //   border: isTheme ? "1px solid white" : "1px solid gray",
                  // }}
                >
                  {/* <div className="final"></div> */}
                  <div className="drop-down">
                    <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Review Details</p>
                    <div
                    // style={{
                    //   // borderRadius: "50%",
                    //   backgroundColor: isTheme ? "#495057" : "",
                    // }}
                    >
                      {/* <img
                        className="dropdown-img"
                        style={{ top: isDrop ? "0px" : "1px" }}
                        src={
                          isDrop
                            ? isTheme
                              ? "./src/assets/images/downarrow-dark.svg"
                              : "./src/assets/images/dropuparrow-dark.svg"
                            : isTheme
                            ? "./src/assets/images/dropdown-dark.svg"
                            : "./src/assets/images/dropdown.svg"
                        }
                        // src={isTheme ?}
                        width={24}
                        alt=""
                        onClick={() => dropDown()}
                      /> */}
                      {isDetails?.updateDetails?.length > 0 ? (
                        <ViewReferralTable
                          detailsToDisplay={isDetails}
                          updatedBy={updatedBy}
                          themeDetails={isTheme}
                        />
                      ) : (
                        <>
                          <div
                            style={{
                              textAlign: "center",
                              padding: "1rem",
                              color: "#7d7c83",
                            }}
                          >
                            {/* <img
                              src="/no-data-icon.svg"
                              alt="No Data"
                              style={{ width: "80px", opacity: 0.6 }}
                            /> */}
                            <h1>No updates recorded yet</h1>
                            {/* <p>
                              Any updates about this candidate’s process will be
                              shown here.
                            </p> */}
                          </div>
                        </>
                      )}
                      {/* {isDetails?.updateDetails?.length > 0 && (
                        <ViewReferralTable
                          detailsToDisplay={isDetails}
                          updatedBy={updatedBy}
                          themeDetails={isTheme}
                        />
                      )} */}
                    </div>
                  </div>

                  {/* {isDrop ? (
                    <div className="final-height">
                      {isDetails?.updateDetails &&
                      updatedBy &&
                      isDetails.updateDetails.length > 0 ? (
                        <ul style={{ color: isTheme ? "white" : "black" }}>
                          {isDetails.updateDetails.map((detail, index) => (
                            <li
                              key={detail._id}
                              className="final_rating"
                              style={{
                                width: "37em",
                                border: isTheme
                                  ? "1px solid white"
                                  : "1px solid gray",
                              }}
                            >
                              <div className="rateby">
                                <div>
                                  <strong>Updated By:</strong>{" "}
                                  {updatedBy && updatedBy[index]
                                    ? updatedBy[index]
                                    : "Unknown"}
                                </div>
                                <div>
                                  <strong>Updated At:</strong>{" "}
                                  {new Date(detail.updatedAt).toLocaleString()}
                                </div>
                              </div>
                              <strong>Reason:</strong> {detail.isReason} <br />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not Updated!</p>
                      )}
                    </div>
                  ) : null} */}
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div style={{ color: isTheme ? "white" : "black" }}>
            <div className="final">
              <div
                className="final_rating"
                style={{
                  border: isTheme ? "1px solid white" : "1px solid gray",
                }}
              >
                <p className="finalP" style={{color:isTheme?"white":"#112a46"}}>Final Rating</p>
                <div>
                  <div className="rateby">
                    <p>
                      <strong>Rating:</strong>{" "}
                      {isDetails?.finalRating || "Yet to give ratings."}
                    </p>
                    <p>
                      <strong>Rated By:</strong>{" "}
                      {isRated || "No rating submitted yet."}
                    </p>
                  </div>
                  <p>
                    <strong>Feedback:</strong>{" "}
                    {isDetails?.feedback || "No feedback provided."}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="final">
                <div
                  className="final_rating "
                  style={{
                    border: isTheme ? "1px solid white" : "1px solid gray",
                  }}
                >
                  <div className="final"></div>
                  <div className="drop-down">
                    <p>Details of Updates</p>
                    <div
                      style={{
                        borderRadius: "50%",
                        backgroundColor: isTheme ? "#495057" : "lightgray",
                      }}
                    >
                      <img
                        className="dropdown-img"
                        style={{ top: isDrop ? "0px" : "1px" }}
                        src={
                          isDrop
                            ? isTheme
                              ? "./src/assets/images/downarrow-dark.svg"
                              : "./src/assets/images/dropuparrow-dark.svg"
                            : isTheme
                            ? "./src/assets/images/dropdown-dark.svg"
                            : "./src/assets/images/dropdown.svg"
                        }
                        // src={isTheme ?}
                        width={24}
                        alt=""
                        onClick={() => dropDown()}
                      />
                    </div>
                  </div>
                  {isDetails?.updateDetails?.length > 0 && (
                    <ViewReferralTable
                      detailsToDisplay={isDetails}
                      updatedBy={updatedBy}
                    />
                  )}
                  {/* {isDrop ? (
                    <div className="final-height">
                      {isDetails?.updateDetails &&
                      updatedBy &&
                      isDetails.updateDetails.length > 0 ? (
                        <ul style={{ color: isTheme ? "white" : "black" }}>
                          {isDetails.updateDetails.map((detail, index) => (
                            <li
                              key={detail._id}
                              className="final_rating"
                              style={{
                                width: "37em",
                                border: isTheme
                                  ? "1px solid white"
                                  : "1px solid gray",
                              }}
                            >
                              <div className="rateby">
                                <div>
                                  <strong>Updated By:</strong>{" "}
                                  {updatedBy && updatedBy[index]
                                    ? updatedBy[index]
                                    : "Unknown"}
                                </div>
                                <div>
                                  <strong>Updated At:</strong>{" "}
                                  {new Date(detail.updatedAt).toLocaleString()}
                                </div>
                              </div>
                              <strong>Reason:</strong> {detail.isReason} <br />
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Not Updated!</p>
                      )}
                    </div>
                  ) : null} */}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="right-content-usermanagement">
        <div className="user-management-section-one">
          <div className="pageHeadings_for_view">
            <span
              className={`referralIcon icon referralIcon-${
                isTheme ? "dark" : "light"
              }`}
            ></span>
            <h4
              onClick={goBackToAllReferrals}
              style={{
                cursor: "pointer",
                color: isTheme ? "white" : "#283e46",
              }}
            >
              Referrals
            </h4>
            <img
              // src={breadCrumbs}
              src={
                isTheme
                  ? "./src/assets/images/breadcrumbs-dark-svgrepo-com.svg"
                  : "./src/assets/images/breadcrumbs-svgrepo-com.svg"
              }
              width={18}
              className="user-management-bread-crumbs"
            />
            <h4
              onClick={backToCurrent}
              style={{
                cursor: "pointer",
                color: isTheme ? "white" : "#283e46",
              }}
            >
              Current
            </h4>
            <img
              // src={breadCrumbs}
              src={
                isTheme
                  ? "./src/assets/images/breadcrumbs-dark-svgrepo-com.svg"
                  : "./src/assets/images/breadcrumbs-svgrepo-com.svg"
              }
              width={18}
              className="user-management-bread-crumbs"
            />
            <span className="sub-dept sub-dept-user">
              {referral.referral_fname} {referral.referral_lname}
            </span>
          </div>
        </div>
        <div className="viewContainer">
          <div
            className="user-date"
            style={{
              background: isTheme ? "#1E1E1E" : "",
            }}
          >
            <div className="view-user">
              <div className="imageLeftSide">
                <img src={referral.avatarUrl} alt="Avatar" />
              </div>
              <div className="user-details">
                <p
                  style={{
                    color: isTheme ? "white" : "#283e46",
                  }}
                >
                  {referral.referral_fname} {referral.referral_lname}
                </p>
                <div className="mailSection">
                  <a
                    href={`mailto:${referral.referral_email}`}
                    style={{
                      color: isTheme ? "rgb(144, 224, 239)" : "#653FFD",
                      textDecoration: "none",
                    }}
                  >
                    <img src={isTheme ? MailDarkIcon : MailIcon} alt="" />

                    {referral.referral_email}
                  </a>
                </div>
              </div>
            </div>
            <div className="profile_Sections">
              <p
                style={{
                  color: isTheme ? "white" : "black",
                }}
                className="porfileHeading"
              >
                Applied For:
              </p>
              <p
                style={{
                  color: isTheme ? "#cccccc" : "#283e46",
                }}
              >
                {referral.role_applied}
              </p>
              {/* <p className="one-detail">Round 1 Date</p> */}
            </div>
            {/* <div>
              <p
                style={{
                  color: isTheme ? "white" : "black",
                }}
              >
                <strong>Referral Status:</strong> {referral.status}
              </p>
              <p className="one-detail">Round 1 Date</p>
            </div> */}
            <div className="profile_Sections">
              <p
                style={{
                  color: isTheme ? "white" : "#283e46",
                }}
                className="porfileHeading"
              >
                Department:
              </p>
              <p
                style={{
                  color: isTheme ? "#cccccc" : "#283e46",
                }}
              >
                {referral.department}
              </p>
              {/* <p className="one-detail">Round 1 Date</p> */}
            </div>

            <div className="profile_Sections">
              {referral.status === "Selected" && (
                <>
                  <div>
                    <p
                      style={{
                        color: isTheme ? "white" : "#283e46",
                      }}
                      className="porfileHeading"
                    >
                      Joining Date:
                    </p>
                    <p
                      style={{
                        color: isTheme ? "#cccccc" : "#283e46",
                      }}
                    >
                      {referral.roundDate === null ? 'Joining Date Not Sent' :  formatDate(referral.roundDate) }
                    </p>
                  </div>
                </>
              )}
              {referral.status === "Rejected" && (
                <>
                  <div>
                    <p
                      style={{
                        color: isTheme ? "white" : "#283e46",
                      }}
                      className="porfileHeading"
                    >
                      Status Updated On{" "}
                    </p>
                    <p
                      style={{
                        color: isTheme ? "#cccccc" : "#283e46",
                      }}
                    >
                      {" "}
                      {formatDate(referral.roundDate)}
                    </p>
                  </div>
                </>
              )}
              {referral.interviewResult === "Pending" &&
                [
                  "Group Discussion",
                  "Technical Assesemnet",
                  "HR Round",
                ].includes(referral.status) && (
                  <>
                    <div>
                      <p
                        style={{ color: isTheme ? "white" : "#283e46" }}
                        className="porfileHeading"
                      >
                        Interview Date:
                      </p>
                      <p
                        style={{
                          color: isTheme ? "#cccccc" : "#283e46",
                        }}
                      >
                        {!referral.roundDate
                          ? "Not Scheduled"
                          : formatDate(referral.roundDate)}
                      </p>
                    </div>
                  </>
                )}
            </div>
            <div className="profile_Sections">
              {referral.interviewResult === "Pending" &&
                [
                  "Group Discussion",
                  "Technical Assesemnet",
                  "HR Round",
                ].includes(referral.status) && (
                  <>
                    <div>
                      <p
                        className="porfileHeading"

                        style={{
                          color: isTheme ? "white" : "#283e46",
                        }}
                      >
                        {!referral.roundDate ? "Scheduled Next:" : "Status"}
                      </p>
                      <p className="status_pTag">
                        <ReferralStatus
                          selectedStatus={referral.status}
                          pageName="view"
                        />
                      </p>
                    </div>
                  </>
                )}
              {(referral.status === "Selected" ||
                referral.status === "Rejected") && (
                <div>
                  <p
                    className="porfileHeading"
                    style={{
                      color: isTheme ? "white" : "#283e46",
                    }}
                  >
                    Status:
                  </p>
                  <p className="status_pTag">
                    <ReferralStatus
                      selectedStatus={referral.status}
                      pageName="view"
                    />
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="viewInterviewResult" style={{border:isTheme?"1px solid #495057":"none"}}>
            <div className="rounds-sec" style={{marginBottom:"2em"}}>
              {/* <div className="round-one">
                <div
                  className="round-section"
                  style={{
                    backgroundColor: getBackgroundColor(0),
                    border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                  }}
                  onClick={() => handleFormClick(1)}
                >
                  <img src={mailStatus} width={40} alt="" />
                </div>
              </div>
              <div
                className={`connect-line connect-line-${
                  isTheme ? "dark" : "light"
                }`}
              >
                <hr style={{ border: `3px solid ${getBackgroundColor(0)}` }} />
              </div> */}
              <div className="round-one">
                <div
                  className="round-section"
                  style={{
                    // backgroundColor: getBackgroundColor(2),
                    // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                    animationDelay: "0.1s",
                    animationPlayState: "running",
                  }}
                  onClick={() => {
                    setDetails(null);
                    handleFormClick(1);
                    fetchData(stages[1], referral._id);
                  }}
                >
                  <div className="round_one_div">
                    <span
                      className={`${
                        isCompletedGD === true ? "completedBg" : "intiallRound"
                      } ${activeStage === 1 ? "roundsActive" : ""}`}
                      // className={`formOne ${
                      //   activeStage === 1 ? "activeBg" : "noBg"
                      // }`}
                          style={{ cursor: "pointer" }}

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
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={groupDiscussion}
                          alt="Group Discussion Default"
                          className="multiStepFormImage"
                          style={{ cursor: "pointer" }}
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
                    // src={groupDiscussion}
                    src={
                      isTheme
                        ? "./src/assets/images/groupDiscussion-dark.svg"
                        : "./src/assets/images/groupDiscussion.svg"
                    }
                    width={40}
                    alt=""
                  /> */}
                </div>
                <div>
                  <hr
                    className={`${
                      isCompletedGD === true ? "activeLineOne" : "viewLine"
                    }`}
                  />
                </div>
              </div>
              {/* view line css in present in rateReferral.css */}

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
                <hr style={{ border: `3px solid ${getBackgroundColor(2)}` }} />
              </div> */}
              <div className="round-one">
                <div
                  className="round-section"
                  style={{
                    // backgroundColor: getBackgroundColor(2),
                    // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                    animationDelay: "0.1s",
                    animationPlayState: "running",
                  }}
                  onClick={() => {
                    setDetails(null);
                    handleFormClick(2);
                    fetchData(stages[2], referral._id);
                  }}
                >
                  <div className="round_one_div">
                    <span
                      className={`${
                        isCompletedTA === true ? "completedBg" : "intiallRound"
                      } ${activeStage === 2 ? "roundsActive" : ""}`}
                          style={{ cursor: "pointer" }}

                    >
                      {activeStage === 2 ? (
                        <img
                          src={technicalCompleted}
                          alt="technical Active"
                          className="multiStepFormImage"
                          // style={{ cursor: "pointer" }}
                        />
                      ) : isCompletedTA === true ? (
                        <img
                          src={technicalActive}
                          alt="technical Completed"
                          className="multiStepFormImage"
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={technical}
                          alt="technical Default"
                          className="multiStepFormImage"
                          style={{ cursor: "pointer" }}
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
                  {/* <img
                    // src={techAssessment}
                    src={
                      isTheme
                        ? "./src/assets/images/tech-assessment-dark.svg"
                        : "./src/assets/images/tech-assessment.svg"
                    }
                    width={40}
                    alt=""
                  /> */}
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
                <hr style={{ border: `3px solid ${getBackgroundColor(3)}` }} />
              </div> */}
              <div className="round-one">
                <div
                  className="round-section"
                  style={{
                    // backgroundColor: getBackgroundColor(3),
                    // border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                    animationDelay: "0.1s",
                    animationPlayState: "running",
                  }}
                  onClick={() => {
                    setDetails(null);
                    handleFormClick(3);
                    fetchData(stages[3], referral._id);
                  }}
                >
                  <div className="round_one_div">
                    <span
                      className={`${
                        isCompletedHR === true ? "completedBg" : "intiallRound"
                      } ${activeStage === 3 ? "roundsActive" : ""}`}
                          style={{ cursor: "pointer" }}

                    >
                      {activeStage === 3 ? (
                        <img
                          src={hrRoundActive}
                          alt="HR Active"
                          className="multiStepFormImageHR"
                          // style={{ cursor: "pointer" }}
                        />
                      ) : isCompletedHR === true ? (
                        <img
                          src={hrRoundCompleted}
                          alt="HR Completed"
                          className="multiStepFormImageHR"
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <img
                          src={hrRound}
                          alt="HR Default"
                          className="multiStepFormImageHR"
                          style={{ cursor: "pointer" }}
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
                    // src={hr}
                    src={
                      isTheme
                        ? "./src/assets/images/hr-dark.svg"
                        : "./src/assets/images/hr.svg"
                    }
                    width={40}
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
                <hr style={{ border: `3px solid ${getBackgroundColor(3)}` }} />
              </div> */}
              {/* <div className="round-one">
                <div
                  className="round-section"
                  style={{
                    backgroundColor: getBackgroundColor(4),
                    border: isTheme ? "1px solid #c0c0c0" : "1px solid black;",
                    animationDelay: "0.1s",
                    animationPlayState: "running",
                  }}
                  onClick={() => {
                    setDetails(null);
                    handleFormClick(5);
                    fetchData(stages[5], referral._id);
                  }}
                >
                  <img
                    // src={selected}
                    src={
                      isTheme
                        ? "./src/assets/images/selected-dark.svg"
                        : "./src/assets/images/selected.svg"
                    }
                    width={40}
                    alt=""
                  />
                </div>
              </div> */}
            </div>
            <div key={activeForm} className={`step-content-transition fade-in`}>
              {renderFormContent()}
            </div>

            {/* <div className="step-content active">{renderFormContent()}</div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewReferral;
