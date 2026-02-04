import React, { useContext, useEffect, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast, ToastContainer } from "react-toastify";

const AddNewReferral = ({
  onClose,
  onReferralAdded,
  referredUserName,
  referredJob,
}) => {
  console.log("referred by", referredJob);
  const { isTheme } = useContext(ThemeContext);
  <ToastContainer theme={isTheme ? "dark" : "light"} />;
  const [isError, setError] = useState("");
  // stores the values from the referral form as the user fills them out.
  const [formData, setFormData] = useState({
    referral_fname: "",
    referral_lname: "",
    // referral_name: "",
    referral_email: "",
    role_applied: "",
    department: "",
    employment_type: "",
    resume_file: "",
  });
  const [file, setFile] = useState();
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const fileName = e.target.files[0];
    setFile(fileName);
  };

  useEffect(() => {
    if (referredJob) {
      setFormData((prev) => ({
        ...prev,
        role_applied: referredJob.jobTitle || "",
        // department: referredJob.jobDepartment || "",
        employment_type: referredJob.jobType || "",
      }));
    }
  }, [referredJob]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(formData);
    if (
      !formData.referral_fname.trim() ||
      !formData.referral_lname.trim() ||
      !formData.referral_email.trim() ||
      !formData.role_applied.trim() ||
      !formData.department.trim() ||
      !formData.employment_type.trim()
    ) {
      setError("All fields are required");
      return; // stop submission if validation fails
    }
    try {
      setSubmitting(true);

      const form = new FormData();
      form.append("referral_fname", formData.referral_fname);
      form.append("referral_lname", formData.referral_lname);
      form.append("referral_email", formData.referral_email);
      form.append("role_applied", formData.role_applied);
      form.append("department", formData.department);
      form.append("employment_type", formData.employment_type);
      form.append("referred_by", referredUserName);
      form.append("status", formData.status);
      // form.append("status", "Submitted for Review");
      if (file) form.append("resume_file", file);

      const res = await fetch(
        "http://localhost:3000/api/v1/referral/allReferrals",
        {
          method: "POST",
          // headers: {
          //   "Content-Type": "application/json",
          // },
          body: form,
        }
      );

      // console.log("Data sending to backend ==>", form);
      // console.log("Intials", form.)
        const result = await res.json();
      if (result.error) {
        // console.log(result.error)
        toast.error(result.error);
      }
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Server response:", errorData);
        setError(result.error);
        // console.log(errorData.error)
        toast.error("Failed to submit referral!");
        return;
        // throw new Error("Failed to submit referral");
      }

      const newUser = result.data;
      // console.log("Referral added:", newUser);
      //   setUserData((prev) => [...prev, newUser]);
      toast.success("Referral submitted Successfully");
      setFormData({
        referral_fname: "",
        referral_lname: "",
        referral_email: "",
        role_applied: "",
        department: "",
        employment_type: "",
      });
      onReferralAdded(newUser); // inform parent about the new referral

      onClose();

      //   setFormOpen(false);
      //   setUserData((prev) => [...prev, newUser]);
      //   setFilteredData((prev) => [...prev, newUser]);
    } catch (err) {
      console.error("Error adding referral:", err);
      // alert("Error adding referral. Check console for more details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div
          className="modal-box"
          style={{
            backgroundColor: isTheme ? "black" : "white",
            border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
          }}
        >
          {/* FORM TO UPDATE */}
          <div className="formHeadings">
            <h1 style={{ color: isTheme ? "white" : "#283e46" }}>
              Referral Information
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            className="modal-form"
            autoComplete="off"
          >
            <div>
              <label
                className="labelCss"
                style={{ color: isTheme ? "white" : "#283e46" }}
              >
                Referral Name*
              </label>
              <div className="namefields">
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="referral_fname"
                  value={formData.referral_fname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                {/* </div>
                          <div> */}
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="referral_lname"
                  value={formData.referral_lname}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
            <div className="secondSectionPart">
              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Email*
                </label>
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="referral_email"
                  type="email"
                  value={formData.referral_email}
                  onChange={handleChange}
                  placeholder=" Refferal Email"
                  required
                />
              </div>
              {/* <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Role*
                </label>
                <select
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "#3e3e3e" : "white",
                  }}
                  name="role_applied"
                  value={formData.role_applied}
                  onChange={handleChange}
                >
                  <option
                    value=""
                    selected
                    disabled
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Select Role
                  </option>
                  <option
                    value="Manager"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Manager
                  </option>
                  <option
                    value="Programmer Analyst Trainee"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Programmer Analyst Trainee
                  </option>
                  <option
                    value="Programmer Analyst"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Programmer Analyst
                  </option>
                </select>
               
              </div> */}

              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Role*
                </label>
                {referredJob ? (
                  <input
                    type="text"
                    name="role_applied"
                    value={formData.role_applied}
                    readOnly
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                      backgroundColor: isTheme ? "#3e3e3e" : "white",
                      cursor: "not-allowed",
                    }}
                  />
                ) : (
                  <select
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                      backgroundColor: isTheme ? "#3e3e3e" : "white",
                    }}
                    name="role_applied"
                    value={formData.role_applied}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Role
                    </option>
                    <option value="Manager">Manager</option>
                    <option value="Programmer Analyst Trainee">
                      Programmer Analyst Trainee
                    </option>
                    <option value="Programmer Analyst">
                      Programmer Analyst
                    </option>
                  </select>
                )}
              </div>

              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Dept*
                </label>
                <select
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "#3e3e3e" : "white",
                  }}
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                >
                  <option
                    value=""
                    selected
                    disabled
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Select Dept
                  </option>
                  <option
                    value="Worksoft"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Worksoft
                  </option>
                  <option
                    value="IA/RPA"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    IA/RPA
                  </option>
                  <option
                    value="Web Development"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Web Development
                  </option>
                </select>
              </div>

              {/* <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Employement Type*
                </label>
                <select
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "#3e3e3e" : "white",
                  }}
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                >
                  <option
                    value=""
                    selected
                    disabled
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Select Employment Type
                  </option>
                  <option
                    value="Full-Time"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Full-Time
                  </option>
                  <option
                    value="Internship"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Internship
                  </option>
                </select>
              </div> */}
              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Employment Type*
                </label>
                {referredJob ? (
                  <input
                    type="text"
                    name="employment_type"
                    value={formData.employment_type}
                    readOnly
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                      backgroundColor: isTheme ? "#3e3e3e" : "white",
                      cursor: "not-allowed",
                    }}
                  />
                ) : (
                  <select
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                      backgroundColor: isTheme ? "#3e3e3e" : "white",
                    }}
                    name="employment_type"
                    value={formData.employment_type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Employment Type
                    </option>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                )}
              </div>

              <div>
                <div className="file-upload">
                  <label
                    htmlFor="fileInput"
                    className={`custom-file-label resume-label-${
                      isTheme ? "dark" : "light"
                    }`}
                  >
                    <FaUpload style={{ marginRight: "8px" }} />
                    Resume
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    className="hidden-file-input"
                    name="resume_file"
                    accept=".pdf,.doc"
                    onChange={handleFileChange}
                  />
                  <span className={file ? "uploaded" : "notUploaded"}>
                    {file ? file.name : "File Not Uploaded!"}
                  </span>
                </div>
                {/* 
                          <input
                            type="file"
                            name="resume_file"
                            accept=".pdf,.doc"
                            id=""
                            onChange={(e) => setFile(e.target.files[0])}
                          /> */}
              </div>
            </div>
            {isError && (
              <div
                className="error-message"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <img src="./src/assets/images/error.svg" width={18} alt="" />
                {isError}
              </div>
            )}
            <div className="submitSection">
              <button type="button" className="close-btn" onClick={onClose}>
                {/* &times; */}
                <span className="cancel_btn cancel_icon_align "></span>
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="submitButton"
              >
                <span className="submit_btn submit_icon_align"></span>

                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewReferral;
