import React, { useContext, useState } from "react";
import { FaUpload, FaTrash } from "react-icons/fa";
import "./EditIndividualReferrals.css";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";

const EditIndividualReferrals = ({
  referralEditData,
  onClose,
  referralId,
  onUpdateSuccess,
}) => {
  const [editFormData, setEditFormData] = useState(referralEditData);
  const [file, setFile] = useState(null);
  const { isTheme } = useContext(ThemeContext);

  // console.log("fromEdit", editFormData);
  // console.log("fromEdit", referralId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log("value", value);
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onDeleteFile = (e) => {
    e.preventDefault();
    setEditFormData((prev) => ({
      ...prev,
      resume_file: null, // or {} depending on your backend handling
    }));
    setFile(null); // also clear uploaded file if needed
  };

  // const handleSubmitEdit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // 1. Update fields (without file)
  //     const resFields = await fetch(
  //       `http://localhost:3000/api/v1/referral/allReferrals/${referralId}`,
  //       {
  //         method: "PUT",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           referral_fname: editFormData.referral_fname,
  //           referral_lname: editFormData.referral_lname,
  //           referral_email: editFormData.referral_email,
  //           role_applied: editFormData.role_applied,
  //           status: editFormData.status,
  //           department: editFormData.department,
  //           employment_type: editFormData.employment_type,
  //         }),
  //       }
  //     );

  //     if (!resFields.ok) throw new Error("Failed to update referral fields");

  //     // 2. If a new file selected, upload file separately
  //     if (file) {
  //       console.log("file upload")
  //       const formData = new FormData();
  //       formData.append("resume_file", file);

  //       const resFile = await fetch(
  //         `http://localhost:3000/api/v1/referral/allReferrals/${referralId}/uploadResume`, // example separate endpoint
  //         {
  //           method: "POST", // or PATCH, depends on your backend
  //           body: formData,
  //         }
  //       );

  //       if (!resFile.ok) throw new Error("Failed to upload resume file");
  //     }

  //     toast.success("Referral Updated Successfully");
  //     onUpdateSuccess();
  //     onClose();

  //   } catch (err) {
  //     console.error(err);
  //     alert("Error updating referral. Check console.");
  //   }
  // };
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    try {
      // Prepare payload
      const payload = {
        referral_fname: editFormData.referral_fname,
        referral_lname: editFormData.referral_lname,
        referral_email: editFormData.referral_email,
        role_applied: editFormData.role_applied,
        status: editFormData.status,
        department: editFormData.department,
        employment_type: editFormData.employment_type,
      };

      // If resume_file is explicitly set to null (deleted), include it
      if (editFormData.resume_file === null) {
        payload.resume_file = null;
      }

      // Make update request (fields + deletion if applicable)
      const resFields = await fetch(
        `http://localhost:3000/api/v1/referral/allReferrals/${referralId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resFields.ok) throw new Error("Failed to update referral");

      // If a new file is selected, upload it in a separate request
      if (file) {
        console.log("Uploading new resume file...");
        const formData = new FormData();
        formData.append("resume_file", file);

        const resFile = await fetch(
          `http://localhost:3000/api/v1/referral/allReferrals/${referralId}/uploadResume`,
          {
            method: "POST", // or PUT/PATCH depending on your backend
            body: formData,
          }
        );

        if (!resFile.ok) throw new Error("Failed to upload resume file");
      }

      toast.success("Referral Updated Successfully");
      onUpdateSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error updating referral. Check console.");
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
          <div className="formHeadings">
            {/* <button className="close-btn" onClick={onClose}>
              &times;
            </button> */}
            <h1 style={{ color: isTheme ? "white" : "#283e46" }}>
              {" "}
              Edit Referral Information
            </h1>
          </div>
          <form
            onSubmit={handleSubmitEdit}
            className="modal-form"
            autoComplete="off"
          >
            <div>
              <label
                className="labelCss"
                style={{ color: isTheme ? "white" : "#283e46" }}
              >
                Referral Name:
              </label>
              <div className="namefields">
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="referral_fname"
                  value={editFormData.referral_fname}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
                {/* </div>
                                <div> */}
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="referral_lname"
                  value={editFormData.referral_lname}
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
                  Email:
                </label>
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="referral_email"
                  type="email"
                  value={editFormData.referral_email}
                  onChange={handleChange}
                  placeholder=" Refferal Email"
                  required
                />
              </div>
              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Role
                </label>
                <input
                  style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  name="role_applied"
                  type="text"
                  value={editFormData.role_applied}
                  onChange={handleChange}
                  placeholder="Role Applied"
                  required
                />
              </div>

              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Dept:
                </label>
                <select
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "#3e3e3e" : "white",
                  }}
                  name="department"
                  value={editFormData.department}
                  onChange={handleChange}
                >
                  <option
                    value=""
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

              <div>
                <label
                  className="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Employement Type
                </label>
                <select
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "#3e3e3e" : "white",
                  }}
                  name="employment_type"
                  value={editFormData.employment_type}
                  onChange={handleChange}
                >
                  <option
                    value=""
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
              </div>
              {/* <div className="resume-upload-section">
                <label className="labelCss">Resume Verification Status:</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleChange}
                >
                  <option
                    value=""
                    disabled
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Select Status
                  </option>
                  <option
                    value="Submitted"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Submitted
                  </option>
                  <option
                    value="Emailed"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Emailed
                  </option>
                  <option
                    value="Group Discussion"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Group Discussion
                  </option>
                  <option
                    value="Technical Assessment"
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                  >
                    Technical Assessment
                  </option>
                  <option value="HR Round">HR Round</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Selected">Selected</option>
                  
                </select>
              </div> */}

              {editFormData.status === "Rejected" && (
                <div>
                  <label className="labelCss">Feed Back</label>
                  <input
                    type="textarea"
                    id="feedback"
                    rows="14"
                    cols="50"
                    placeholder="Enter your feedback here"
                    style={{
                      width: "100%",
                      padding: "0.5em",
                      resize: "vertical",
                    }}
                  />
                </div>
              )}

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
                    onChange={(e) => {
                      console.log(e.target.files[0]);
                      setFile(e.target.files[0]);
                    }}
                  />

                  {editFormData.resume_file?.filename && (
                    <div
                      className="deleteSection"
                      style={{
                        color: isTheme ? "white" : "black",
                        fontSize: "14px",
                        margin: "6px",
                      }}
                    >
                      {/* <a href={url}></a> */}
                      {editFormData.resume_file.filename}
                      <button
                        className="deletedIconc"
                        title="Delete"
                        onClick={onDeleteFile}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}

                  {/* <div className="deleteSection">
                    {editFormData.resume_file.filename}
                    <button className="deletedIconc" title="Delete" onClick={onDeleteFile}>
                      <FaTrash/>
                    </button>
                  </div> */}
                </div>
              </div>
              {/* </div> */}
            </div>

            <div className="submitSection">
              <button className="close-btn" onClick={onClose}>
                {/* &times; */}
                <span className="cancel_btn cancel_icon_align "></span>
                Cancel
              </button>
              <button
                type="submit"
                // disabled={submitting}
                className="submitButton"
              >
                <span className="submit_btn submit_icon_align"></span>
                Update
                {/* {submitting ? "Submitting..." : "Submit"} */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditIndividualReferrals;
