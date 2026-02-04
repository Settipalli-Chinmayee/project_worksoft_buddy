import React, { useContext } from "react";
import { FaUpload } from "react-icons/fa";
import { FaFileAlt, FaEye } from "react-icons/fa";

import "./ViewIndividualReferral.css";
import ReferralStatus from "../ReferralStatus/ReferralStatus";
import cancel from "../../assets/images/cancel.svg";
import { ThemeContext } from "../ThemeContext/ThemeContext";

const ViewIndividualReferrals = ({
  referralData,
  onClose,
  // referralId,
  // onUpdateSuccess,
}) => {
  // console.log("from view", referralData.resume_file);
  const { isTheme } = useContext(ThemeContext);
  // const statusColors = {
  //   "Resubmission Required": "#17a2b8",
  //   "Submitted for Review": "#343a40",
  //   "In Valid": "#800000",
  //   "In Review": "#007bff",
  //   "Not Verified": "#dc3545",
  //   Verified: "#28a745",
  //   Accepted: "green",
  // };

  return (
    <>
      <div className="modal-overlay  formUI">
        <div
          className="modal-box"
          style={{
            backgroundColor: isTheme ? "black" : "white",
            border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
          }}
        >
          <div className="formHeadingsView">
            <div className="referralStatusView"></div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {" "}
              <h1 style={{ color: isTheme ? "white" : "#283e46" }}>
                {" "}
                View Referral Information
              </h1>
              <ReferralStatus
                selectedStatus={referralData.status}
                // style={{ textAlign: "center", padding: "0.5em 0.6em" }}
                displaysIn="view"
              />
            </div>
          </div>
          <form className="modal-form forms viewSectionContainer">
            <div>
              <label
                class="labelCss"
                style={{ color: isTheme ? "white" : "#283e46" }}
              >
                Referral Name*
              </label>
              <div className="namefields">
                <input
                  name="referral_fname"
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "black" : "white",
                  }}
                  value={referralData.referral_fname}
                  // onChange={handleChange}
                  placeholder="First Name"
                  required
                  readOnly
                  className="disabledFileds"
                />
                {/* </div>
                                <div> */}
                <input
                  name="referral_lname"
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "black" : "white",
                  }}
                  value={referralData.referral_lname}
                  placeholder="Last Name"
                  required
                  className="disabledFileds"
                  readOnly
                />
              </div>
            </div>
            <div className="secondSectionPart">
              <div>
                <label
                  class="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Email*
                </label>
                <input
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "black" : "white",
                  }}
                  name="referral_email"
                  type="email"
                  value={referralData.referral_email}
                  placeholder=" Refferal Email"
                  readOnly
                  className="disabledFileds"
                />
              </div>
              <div>
                <label
                  class="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Role*
                </label>
                <input
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "black" : "white",
                  }}
                  name="role_applied"
                  type="text"
                  value={referralData.role_applied}
                  placeholder="Role Applied"
                  readOnly
                  className="disabledFileds"
                />
              </div>
              <div>
                <label
                  class="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Dept*
                </label>
                <input
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "black" : "white",
                  }}
                  name="role_applied"
                  type="text"
                  value={referralData.department}
                  placeholder="Role Applied"
                  readOnly
                  className="disabledFileds"
                />
              </div>

              <div>
                <label
                  class="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Employement Type*
                </label>
                <input
                  style={{
                    color: isTheme ? "#adb5bd" : "#343a40",
                    backgroundColor: isTheme ? "black" : "white",
                  }}
                  name="role_applied"
                  type="text"
                  value={referralData.employment_type}
                  placeholder="Role Applied"
                  readOnly
                  className="disabledFileds"
                />
              </div>
              <div>
                <label
                  class="labelCss"
                  style={{ color: isTheme ? "white" : "#283e46" }}
                >
                  Attached Resume*
                </label>
                {referralData.resume_file?.data ? (
                  (() => {
                    const byteArray = new Uint8Array(
                      referralData.resume_file.data.data
                    ); // .data inside .data is likely from MongoDB's Binary
                    const blob = new Blob([byteArray], {
                      type:
                        referralData.resume_file.mimetype || "application/pdf",
                    });
                    const url = URL.createObjectURL(blob);

                    return (
                      <>
                        <div className="viewResumeSection">
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="fileName"
                          >
                            <FaFileAlt style={{ marginRight: "5px" }} />
                            {referralData.resume_file.filename}
                          </a>

                          {/* <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="viewResume"
                          >

                            View
                          </a> */}
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <span style={{ color: isTheme ? "white" : "#283e46", fontSize:"14px" }}>No resume attached</span>
                )}
              </div>
            </div>
            <div className="submitSection">
              <button className="close-btn" onClick={onClose}>
                {/* &times; */}
                <span className="cancel_btn cancel_icon_align "></span>
                Cancel
              </button>
            </div>
            {/* <div className="statusSection">
                <label>Resume Verification Status:</label>
                <input
                  type="hidden"
                  name="status"
                  id=""
                  style={{
                    color: statusColors[referralData.status],
                    border: `1.5px solid ${statusColors[referralData.status]}`,
                    // borderRadius:

                    // fontWeight: "bold",
                    // background: statusColors[referralData.status]
                  }}
                  value={referralData.status}
                />
                <span
                className="justDisplay"
                  style={{
                    color: statusColors[referralData.status],
                    border: `1.5px solid ${statusColors[referralData.status]}`,
                    padding: "0.4rem",
                    fontSize : "0.9em",
                    borderRadius: "4px",
                    textAlign : "center",
                    width: "200px"
                    // borderRadius:

                    // fontWeight: "bold",
                    // background: statusColors[referralData.status]
                  }}
                >
                  {referralData.status}
                </span>
              </div> */}

            {/* <button
              type="submit"
              // disabled={submitting}
              className="submitButton"
            >
            Submit
            </button> */}
          </form>
        </div>
      </div>
    </>
  );
};

export default ViewIndividualReferrals;
