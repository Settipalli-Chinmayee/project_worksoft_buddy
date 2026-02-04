import { useContext, useState } from "react";
import "../Hiring/hiring.css";
import { Navigate, useNavigate } from "react-router-dom";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";

const HiringEdit = ({ closeModal, job, onSuccess }) => {
  // console.log(job._id);
  const [id] = useState(job._id);
  const [jobTitle, setJobTitle] = useState(job.jobTitle || "");
  const [jobDescription, setJobDescription] = useState(
    job.jobDescription || ""
  );
  const [jobSkills, setJobSkills] = useState(job.jobSkills || "");
  const [jobQualification, setJobQualification] = useState(
    job.jobQualification || ""
  );
  const [jobType, setJobType] = useState(job.jobType || "");
  const [endDate, setendDate] = useState(job.endDate || "");
  const navigate = useNavigate();
  const [isError, setError] = useState("");
  const { isTheme } = useContext(ThemeContext);
  const getData = async (e) => {
    e.preventDefault();
    if (
      endDate === "" ||
      jobDescription === "" ||
      jobQualification === "" ||
      jobSkills === "" ||
      jobTitle === "" ||
      jobType === ""
    ) {
      setError("All the feilds are required");
    }
    const data = {
      jobTitle,
      jobDescription,
      jobSkills,
      jobQualification,
      jobType,
      endDate,
    };
    // console.log(data);
    const jobId = job._id;
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/referral/hiringEdit/${jobId}`,
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
        setJobTitle("");
        setJobDescription("");
        setJobSkills("");
        setJobQualification("");
        setJobType("");
        setendDate("");
        closeModal();

        onSuccess();
        toast.success("Updated Successfully");
        // console.log("Updated Successfully");
      } else {
        console.log("Error: ", response.status);
      }
    } catch (error) {
      console.log(error.name);
      console.log(error.message);
    }
  };

  const startFromToday = new Date().toISOString().split("T")[0];

  return (
    <>
      <div>
        <form
          action="#"
          className=" formUI hire-form"
          onSubmit={getData}
          autoComplete="off"
        >
          <div className="form-job-img">
            <img
              className=""
              src={
                isTheme
                  ? "./src/assets/images/employee-job-post-dark-svgrepo-dark.svg"
                  : "./src/assets/images/employee-job-post-svgrepo-com.svg"
              }
              alt=""
              width={26}
            />
            <label
              className="title-name"
              htmlFor="jobTitle"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Job Title:
            </label>
          </div>
          <input
            style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
            type="text"
            name="job_Title"
            id="jobTitle"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
          />
          <div className="form-job-img">
            <img
              src={
                isTheme
                  ? "./src/assets/images/des-dark-svgrepo-com.svg"
                  : "./src/assets/images/des-svgrepo-com.svg"
              }
              width={18}
              alt=""
            />
            <label
              htmlFor="jobDes"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Job Description:
            </label>
          </div>
          <textarea
            style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
            className="form_textarea"
            type="text"
            name="job_Des"
            id="jobDes"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>
          <div className="form-job-img">
            <img
              src={
                isTheme
                  ? "./src/assets/images/light-bulb-post-dark-svgrepo-com.svg"
                  : "./src/assets/images/light-bulb-post-svgrepo-com.svg"
              }
              width={20}
              alt=""
            />
            <label
              htmlFor="jobSkills"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Skills:
            </label>
          </div>
          <input
            style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
            type="text"
            name="job_Skills"
            id="jobSkills"
            value={jobSkills}
            onChange={(e) => setJobSkills(e.target.value)}
          />
          <div className="form-job-img">
            <img
              src={
                isTheme
                  ? "./src/assets/images/education-cap-post-dark-svgrepo-com.svg"
                  : "./src/assets/images/education-cap-post-svgrepo-com.svg"
              }
              // src="./src/assets/images/education-cap-post-svgrepo-com.svg"
              width={20}
              alt=""
            />
            <label
              htmlFor="jobQua"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Qualifications:
            </label>
          </div>
          <input
            style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
            type="text"
            name="job_Qua"
            id="jobQua"
            value={jobQualification}
            onChange={(e) => setJobQualification(e.target.value)}
          />
          <div className="form-job-img">
            <img
              src={
                isTheme
                  ? "./src/assets/images/job-post-dark-svgrepo-com.svg"
                  : "./src/assets/images/job-post-svgrepo-com.svg"
              }
              width={20}
              alt=""
            />
            <label
              htmlFor="jobType"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Job Type:
            </label>
          </div>
          <input
            style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
            type="text"
            name="job_Type"
            id="jobType"
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
          />
          <div className="form-job-img">
            <img
              src="./src/assets/images/deadline-stopwatch-hourglass-svgrepo-com.svg"
              width={20}
              alt=""
            />
            <label
              htmlFor="endDate"
              style={{ color: isTheme ? "white" : "#283e46" }}
            >
              Apply By:
            </label>
          </div>
          <input
            style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
            type="date"
            name="end_date"
            id="endDate"
            min={startFromToday}
            value={endDate}
            onChange={(e) => setendDate(e.target.value)}
          />
          <div style={{ textAlign: "center" }}>
            {isError && (
              <>
                <div style={{display: "flex", justifyContent: "center"}}>
                  <img
                    src="./src/assets/images/error.svg"
                    // className="error-icon"
                    width={16}
                    alt="Error"
                  />
                  <span role="alert" style={{ color: "red", fontSize: "14px" }}>
                    {isError}
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="button-hire">
            <button className=" cancel-btn" type="button" onClick={closeModal}>
              <span class="cancel_btn cancel_icon_align "></span>
              Cancel
            </button>
            <button className="submitButton" type="submit">
              <span className="update_btn submit_icon_align"></span>
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default HiringEdit;
