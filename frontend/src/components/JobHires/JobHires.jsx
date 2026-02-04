import React, { useContext, useEffect, useState } from "react";
import Hiring from "../Hiring/Hiring";
import "../JobHires/jobhires.css";
import HiringEdit from "../HiringEdit/HiringEdit";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import applicationClosed from "../../assets/images/applicationClosed.svg";
import { useAuth } from "../UserContext/UserContext";
import { useLocation } from "react-router-dom";

const JobHires = () => {
  document.title = "HR Referral | Job Posting";
  const { authState } = useAuth();
  const userStatus = authState?.user?.status;
  const userRoleAccess = authState?.user?.userRole;

  const location = useLocation();
  const state = location.state;
  const [isHiringVisible, setIsHiringVisible] = useState(false);
  const [isDetails, setIsDetails] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isJobDetails, setJobDetails] = useState(null);
  const [isPopup, setPopup] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerSlide = 6;
  const [skillSlide, setSkillSlide] = useState(false);
  const [isSkillId, setSkillId] = useState("");
  const [isCurrentSkillSlide, setCurrentSkillSlide] = useState(0);
  const { isTheme } = useContext(ThemeContext);

  const toggleHiringModal = () => {
    setIsHiringVisible(!isHiringVisible);
  };

  const closeModal = () => {
    setIsHiringVisible(false);
  };

  const handleNewJob = (newJob) => {
    setIsDetails((prevDetails) => [...prevDetails, newJob]);
    closeModal();
  };

  const fetchData = async () => {
    // console.log(userStatus, "user status in all jobs route");
    // const data = {userStatus}
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/allJobs",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsDetails(data);
        console.log("DATA", data);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const viewActions = (index) => {
    setVisibleIndex(visibleIndex === index ? null : index);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setVisibleIndex(null);
  };

  const handleDelete = async (index) => {
    const jobToDelete = isDetails[index];
    const jobId = jobToDelete._id;

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/referral/deleteJob/${jobId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // If the delete is successful, update the frontend state
        const updatedData = isDetails.filter((item, idx) => idx !== index);
        console.log("updateData", updatedData);
        setIsDetails(updatedData);
      } else {
        // Handle error if DELETE fails
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error.message);
    }
  };

  const closeEditModal = () => {
    setEditIndex(null);
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  const nextSlide = () => {
    if (currentSlide < Math.floor(isDetails.length / itemsPerSlide)) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  const currentDepartments = isDetails.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-GB", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month} -${year}`;
  };

  const displaySkills = (index, skill) => {
    // console.log(index, "index")
    // console.log(skill, "skills")
    if (isSkillId === index) {
      // If skills are visible, hide them
      setSkillSlide(null); // Hide skills
      setSkillId(null); // Reset skillId to hide skills and reset the arrow
    } else {
      // If skills are not visible, show them
      setSkillSlide(skill); // Set the skills to be displayed
      setSkillId(index); // Set the current index to highlight that skills are being displayed
    }
  };

  return (
    <>
      <div className="main-container">
        <ReferralSidebar />
        <div className="main-content">
          <div className="table-container">
            <div className="right-content-usermanagement">
              <div className="user-management-section">
                <div className="user-management">
                  <div className="user-management-section-one">
                    <div className="pageHeadings">
                      <span
                        className={`hiringIcon iconUser iconHire-${
                          isTheme ? "dark" : "light"
                        }`}
                      ></span>
                      <h4
                        style={{
                          color: isTheme ? "white" : "#283e46",
                        }}
                      >
                        Job Postings
                      </h4>
                    </div>
                    {userRoleAccess !== "Employee" && (
                      <p
                        onClick={toggleHiringModal}
                        className="invite-user-btn"
                      >
                        <span className="button_post_job"></span>
                        Post Job
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {isHiringVisible && (
                <div className="modal-overlay">
                  <div
                    className="modal-box"
                    style={{
                      backgroundColor: isTheme ? "black" : "white",
                      border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                    }}
                  >
                    <Hiring
                      closeModal={closeModal}
                      onNewJob={handleNewJob}
                      onSuccess={fetchData}
                    />
                  </div>
                </div>
              )}

              <div>
                {loading ? (
                  <SkeletonTheme
                    baseColor={isTheme ? "#4b556380" : "#e0e0e0"}
                    highlightColor={isTheme ? "#6b7280" : "#f5f5f5"}
                  >
                    <div className="job-list">
                      {[...Array(6)].map((_, index) => (
                        <div
                          key={index}
                          className="cardTemp"
                          style={{
                            backgroundColor: isTheme ? "#474747" : "white",
                          }}
                        >
                          <div className="card_Design">
                            <div className="job-title-div">
                              <p className="date-skeleton">
                                <Skeleton width={50} height={10} />
                              </p>
                              <p className="job-font-size">
                                <Skeleton height={50} width="10em" />
                              </p>
                              <p className="job-font-size-date">
                                <Skeleton height={10} width="10em" />
                              </p>
                            </div>
                            {/* <Skeleton height={20} width="60%" /> */}
                            <Skeleton
                              count={3}
                              height={10}
                              width="80%"
                              className="my-2"
                            />
                            {/* <div className="action-btn">
                              <Skeleton width={100} height={20} />
                            </div> */}
                          </div>
                          <div className="cardDesign">
                            <Skeleton circle width={25} height={25} />
                            <Skeleton circle width={25} height={25} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </SkeletonTheme>
                ) : isDetails.length > 0 ? (
                  <div className="job-list">
                    {isDetails
                      .sort((a, b) => {
                        const now = new Date();
                        if (now < a.endDate) {
                          console.log("Now");
                        }
                        // console.log("a", a.endDate);
                        // console.log("b", b.endDate);
                        const aHiring = new Date(a.endDate) > now;
                        // console.log("a hiring", aHiring)
                        const bHiring = new Date(b.endDate) > now;
                        // console.log(" hiring", bHiring)

                        // First sort by hiring status (true comes first)
                        if (aHiring !== bHiring) {
                          // setHiringSticker(true)
                          // console.log(aHiring);
                          return bHiring - aHiring; // active jobs first
                        }

                        // If both are same (both active or both closed), sort by endDate descending
                        return new Date(b.endDate) - new Date(a.endDate);
                      })

                      .slice(
                        currentSlide * itemsPerSlide,
                        (currentSlide + 1) * itemsPerSlide
                      )
                      .map((job, index) => {
                        // console.log("index", index);
                        // console.log("job", job);
                        const currentDate = new Date();
                        const jobEndDate = new Date(job.endDate);
                        const isHiringActive = jobEndDate > currentDate;
                        // const currentDate = new Date();
                        // const jobEndDate = new Date(job.endDate);
                        // const today = new Date();
                        // const endDate = new Date(formatDate(job.endDate));
                        // const isClosed = currentDate >= endDate;

                        // const isHiringActive = jobEndDate > currentDate;
                        // alert(isHiringActive);

                        return (
                          <div key={index} className="">
                            <div
                              className="cardTemp hello"
                              key={index}
                              style={{
                                backgroundColor: isTheme ? "#474747" : "white",
                              }}
                            >
                              <div className="card_Design">
                                <div className="job-title-div">
                                  {isHiringActive ? (
                                    <p className="date-details">
                                      <img
                                        src="./src/assets/images/trend-up-svgrepo-com.svg"
                                        width={18}
                                        alt="Hiring Icon"
                                      />
                                      Hiring
                                    </p>
                                  ) : (
                                    <p className="application-closed">
                                      <img
                                        src={applicationClosed}
                                        width={18}
                                        alt="Hiring Icon"
                                      />
                                      Application Closed
                                    </p>
                                  )}
                                  {skillSlide && isSkillId === index ? (
                                    <div className="skill-dis">
                                      {Array.isArray(skillSlide) ? (
                                        skillSlide.map((skill, index) => (
                                          <p key={index}>{skill.trim()}</p> // Split skills if it's an array
                                        ))
                                      ) : typeof skillSlide === "string" ? (
                                        skillSlide
                                          .split(",") // Split the string by commas
                                          .map((skill, index) => (
                                            <p key={index}>{skill.trim()}</p> // Display each skill
                                          ))
                                      ) : (
                                        <p>No skills available</p> // Fallback if skillSlide is neither an array nor a string
                                      )}
                                    </div>
                                  ) : (
                                    <p className="job-font-size">
                                      {job.jobTitle}
                                    </p>
                                  )}
                                  {isHiringActive ? (
                                    <p className="job-font-size-date">
                                      <span>Apply By:</span>{" "}
                                      {formatDate(job.endDate)}
                                    </p>
                                  ) : (
                                    <p className="job-application-closed ">
                                      <span>Closed on:</span>{" "}
                                      {formatDate(job.endDate)}
                                    </p>
                                  )}
                                </div>
                                {/* <div className="job-skills-arrow">
                                  <img
                                    src={
                                      skillSlide && isSkillId === index
                                        ? "./src/assets/images/left-arrow-svgrepo-com.svg"
                                        : "./src/assets/images/jobSkillsArrow.svg"
                                    }
                                    alt=""
                                    className="skill-image"
                                    onClick={() =>
                                      displaySkills(index, job.jobSkills)
                                    }
                                  />
                                </div> */}

                                {/* <p className="job-font-size-date">Apply By:</p>
                                <p className="job-font-size-date">{formatDate(job.endDate)}</p> */}
                              </div>
                              <div className="cardDesign">
                                <div>
                                  <img
                                    src="./src/assets/images/qlogo.svg"
                                    alt=""
                                    className="job_post_qlogo"
                                  />
                                </div>

                                <button
                                  onClick={() =>
                                    setJobDetails(
                                      isJobDetails === index ? null : index
                                    )
                                  }
                                  className="info_btn"
                                >
                                  <img src="./src/assets/images/job_post_info.svg" />
                                  Info
                                </button>
                                {/* <img
                                  src="./src/assets/images/info-job-svgrepo-com.svg"
                                  alt="view arrow"
                                  className="postInfo"
                                  width={24}
                                  onClick={() =>
                                    setJobDetails(
                                      isJobDetails === index ? null : index
                                    )
                                  }
                                /> */}
                              </div>
                            </div>

                            {isJobDetails === index && (
                              <div className="modal-overlay">
                                <div className="modal-box">
                                  <div
                                    className="jobDetails"
                                    style={{
                                      backgroundColor: isTheme
                                        ? "black"
                                        : "white",
                                      border: isTheme
                                        ? "1px solid #8d8d8d"
                                        : "1px solid white",
                                    }}
                                  >
                                    <div className="close-img">
                                      <img
                                        className="close-img cancel-img"
                                        src={
                                          isTheme
                                            ? "./src/assets/images/close-circle-dark-svgrepo-com.svg"
                                            : "./src/assets/images/close-circle-svgrepo-com.svg"
                                        }
                                        alt="close"
                                        width={32}
                                        onClick={() => setJobDetails(null)}
                                      />
                                    </div>
                                    <div className="job-poster">
                                      <div className="poster-logo">
                                        <img
                                          src="./src/assets/images/qlogo.svg"
                                          alt=""
                                          width={50}
                                        />
                                      </div>
                                      <h1
                                        style={{
                                          color: isTheme ? "white" : "black",
                                        }}
                                      >
                                        We're Hiring!
                                      </h1>
                                    </div>
                                    <div className="jobSec">
                                      <div className="jobSec-det">
                                        <div className="jobTitle">
                                          <img
                                            className="hire-img"
                                            src="./src/assets/images/employee-job-svgrepo-com.svg"
                                            alt=""
                                          />
                                          <h1
                                            style={{
                                              color: isTheme
                                                ? "white"
                                                : "#283e46",
                                            }}
                                          >
                                            {job.jobTitle}
                                          </h1>
                                        </div>
                                        <div className="postJobSection">
                                          <div className="eachJobSection">
                                            <div className="detail-img">
                                              <img
                                                src="./src/assets/images/point-out-svgrepo-com.svg"
                                                width={18}
                                                alt=""
                                              />
                                              <h2
                                                style={{
                                                  color: isTheme
                                                    ? "white"
                                                    : "#283e46",
                                                }}
                                              >
                                                Description
                                              </h2>
                                            </div>
                                            <p
                                              style={{
                                                color: isTheme
                                                  ? "#a0a0a0"
                                                  : "gray",
                                              }}
                                            >
                                              {job.jobDescription}
                                            </p>
                                          </div>
                                          <div className="eachJobSection">
                                            <div className="detail-img">
                                              <img
                                                src="./src/assets/images/light-bulb-svgrepo-com.svg"
                                                width={20}
                                                alt=""
                                              />
                                              <h2
                                                style={{
                                                  color: isTheme
                                                    ? "white"
                                                    : "#283e46",
                                                }}
                                              >
                                                Skills
                                              </h2>
                                            </div>
                                            <p
                                              style={{
                                                color: isTheme
                                                  ? "#a0a0a0"
                                                  : "gray",
                                              }}
                                            >
                                              {job.jobSkills}
                                            </p>
                                          </div>
                                          <div className="eachJobSection">
                                            <div className="detail-img">
                                              <img
                                                src="./src/assets/images/education-cap-svgrepo-com.svg"
                                                width={20}
                                                alt=""
                                              />
                                              <h2
                                                style={{
                                                  color: isTheme
                                                    ? "white"
                                                    : "#283e46",
                                                }}
                                              >
                                                Qualification
                                              </h2>
                                            </div>
                                            <p
                                              style={{
                                                color: isTheme
                                                  ? "#a0a0a0"
                                                  : "gray",
                                              }}
                                            >
                                              {job.jobQualification}
                                            </p>
                                          </div>
                                          <div className="eachJobSection">
                                            <div className="detail-img">
                                              <img
                                                src="./src/assets/images/job-svgrepo-com.svg"
                                                width={20}
                                                alt=""
                                              />
                                              <h2
                                                style={{
                                                  color: isTheme
                                                    ? "white"
                                                    : "#283e46",
                                                }}
                                              >
                                                Job Type
                                              </h2>
                                            </div>
                                            <p
                                              style={{
                                                color: isTheme
                                                  ? "#a0a0a0"
                                                  : "gray",
                                              }}
                                            >
                                              {job.jobType}
                                            </p>
                                          </div>
                                          <div className="eachJobSection">
                                            <div className="detail-img">
                                              <img
                                                src="./src/assets/images/deadline-stopwatch-hourglass-svgrepo-com.svg"
                                                width={20}
                                                alt=""
                                              />
                                              <h2
                                                style={{
                                                  color: isTheme
                                                    ? "white"
                                                    : "#283e46",
                                                }}
                                              >
                                                Apply By
                                              </h2>
                                            </div>

                                            <p
                                              style={{
                                                color: isTheme
                                                  ? "#a0a0a0"
                                                  : "gray",
                                              }}
                                            >
                                              {formatDate(job.endDate)}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <div className="postJobBtns">
                                          {userRoleAccess !== "Employee" && (
                                            <button
                                              onClick={() => handleEdit(index)}
                                              className="job_post_btn"
                                            >
                                              <span className="edit_post_job postIconJob"></span>
                                              Edit
                                            </button>
                                          )}

                                          {/* <button className="job_post_btn">
                                            <span className="refer_post_job postIconJob"></span>
                                            <Link to="/allReferrals">
                                              Refer
                                            </Link>
                                          </button> */}
                                          {isHiringActive && (
                                            <Link
                                              to="/allReferrals"
                                              state={{
                                                openReferralModal: true,
                                                referredJob:job
                                              }}
                                            >
                                              <button className="job_post_btn" type="button">
                                                <span className="refer_post_job postIconJob"></span>
                                                {/* <Link to="/allReferrals">
                                                Refer
                                              </Link> */}
                                                Refer
                                              </button>
                                            </Link>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {editIndex === index && (
                              <div className="modal-overlay">
                                <div
                                  className="modal-box"
                                  style={{
                                    backgroundColor: isTheme
                                      ? "black"
                                      : "white",
                                    border: isTheme
                                      ? "1px solid #8d8d8d"
                                      : "1px solid white",
                                  }}
                                >
                                  <HiringEdit
                                    closeModal={closeEditModal}
                                    job={job}
                                    onSuccess={fetchData}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <p>No job details available</p>
                )}
                <div className="slide-buttons-one">
                  <button
                    onClick={prevSlide}
                    className="prev-btn"
                    disabled={currentSlide === 0}
                  >
                    {/* Previous */}
                    <div className="slide-back">
                      <img
                        src="./src/assets/images/downward-svgrepo-com.svg"
                        alt=""
                        width={32}
                      />
                    </div>
                  </button>
                  <button
                    className="nexrbtn"
                    onClick={nextSlide}
                    disabled={
                      currentSlide >=
                        Math.floor(isDetails.length / itemsPerSlide) ||
                      isDetails.slice((currentSlide + 1) * itemsPerSlide)
                        .length === 0
                    }
                  >
                    {/* Next */}
                    <div className="slide-back">
                      <img
                        src="./src/assets/images/next-svgrepo-com(1).svg"
                        alt=""
                        width={32}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobHires;
