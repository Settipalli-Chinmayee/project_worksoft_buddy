import React, { useContext, useState, useEffect } from "react";
import MailContent from "../MailContent/MailContent";
import { useAuth } from "../UserContext/UserContext";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";

const ScheduleMail = ({
  closeModal,
  count,
  id_referral,
  roundTypeForEmail,
  isMailData,
  fetchCurrent,
  // fetchCurrentTable,
  refreshData,
  role_id,
  isNote,
}) => {
  console.log(isNote, "isReferral");
  // alert(roundTypeForEmail)
  // console.log("roundTypeForEmail", roundTypeForEmail);

  // console.log(
  //   `Round for Email = ${roundTypeForEmail}, Count to send email = ${count}`
  // );
  // roundTypeForEmail contains a value like 'gd' or 'technical', representing the specific tab and round for sending the email
  const [isError, setError] = useState("");
  const [isTotal, setTotal] = useState("");
  const { authState } = useAuth();
  const userIdAccess = authState?.user?.userId;
  const userEmail = authState?.user?.userEmail;
  const [isMail, setMail] = useState(false);
  const [formData, setFormData] = useState({
    out_Num: "",
    scheDate: "",
  });
  const startFromToday = new Date().toISOString().split("T")[0];

  const { isTheme } = useContext(ThemeContext);

  let headings = "";

  switch (roundTypeForEmail) {
    case "all":
      headings = "Schedule Email for Group Discussion";
      break;
    case "Group Discussion":
      headings = "Schedule Email for Technical";
      break;
    case "Technical Assessment":
      headings = "Schedule Email for Final HR";
      break;
    case "HR Round":
      headings = "Schedule Email for Final HR Discussion";
      break;
    case "Rejected":
      headings = "Schedule Email to Kindly Notify Candidate of the Decision";
      break;
    case "Selected":
      headings = "Schedule Email to Send Offer Letter to Selected Candidate";
      break;
    // Add more cases if needed
    default:
      headings = "";
  }

  //   const [isError, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    setFormData({
      ...formData,
      [name]: value,
    });

    console.log(formData);
    console.log(formData.scheDate);

    // if (name === "out_Num") {
    //   const numericValue = Math.min(
    //     Number(value),
    //     countNewAndSubmittedReferrals().counts
    //   );
    //   console.log(numericValue);
    // }
    // if (name === "out_Num") {
    //   //   const { counts, ids } = countNewAndSubmittedReferrals();
    //   const counts = count;
    //   const ids = id_referral;
    //   const role = role_id;

    //   let numericValue = Number(value);

    //   // Ensure the numeric value doesn't exceed the available referral count
    //   if (numericValue > counts) {
    //     numericValue = counts;
    //   }

    //   console.log("Requested number of IDs:", numericValue);

    //   // Take exactly 'numericValue' number of IDs from the array
    //   const selectedIds = ids.slice(0, numericValue);

    //   console.log("Selected referral IDs:", selectedIds);

    //   // Update the form data with the numeric value and the selected IDs
    //   setFormData({
    //     ...formData,
    //     [name]: numericValue, // Store the numeric value entered by the user
    //     selectedReferralIds: selectedIds.join(","), // Store the actual selected referral IDs as a comma-separated string
    //   });
    // }
    if (name === "out_Num") {
      const counts = count;
      const ids = id_referral;
      const roles = role_id;

      let numericValue = Number(value);

      if (numericValue > counts) {
        numericValue = counts;
      }

      const selectedIds = ids.slice(0, numericValue);

      // Filter roles for the selected IDs
      const selectedRoles = roles.filter((item) =>
        selectedIds.includes(item.id)
      );

      console.log("Selected referral IDs:", selectedIds);
      console.log("Selected roles:", selectedRoles);

      setFormData({
        ...formData,
        [name]: numericValue,
        selectedReferralIds: selectedIds.join(","),
        selectedReferralRoles: selectedRoles, // Store this for use in mail or confirmation
      });
    }
  };

  const mailContent = () => {
    if (formData.scheDate && formData.selectedReferralIds) {
      // alert(formData.scheDate);
      setMail(true);
    } else {
      setError("Please enter the values!");
    }
  };
  const sendMail = async (mailContentData) => {
    // e.preventDefault();
    const mailData = {
      scheduleDate: formData.scheDate,
      userMail: userEmail,
      // totalCandidates: countNewAndSubmittedReferrals().ids,
      totalCandidates: formData.selectedReferralIds,
      role: formData.selectedReferralRoles,
      mailSent: new Date(),
      sentBy: userIdAccess,
      ...mailContentData,
    };

    console.log(mailContentData, "mailData");
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/scheduleOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mailData),
        }
      );
      // console.log(response)
      if (response.ok) {
        toast.success("Mail sent successfully!");
        setFormData("");
        closeModal();
        setMail(false);
        fetchCurrent();
        console.log("refreshData:", refreshData);

        if (refreshData) {
          refreshData(); // ✅ this triggers table update in FinalHR
        }
        // fetchCurrentTable();
      }
      // toast.error("Mail sent unsuccessfully!");
      // console.log("error")
    } catch (error) {
      console.log(error.message);
      toast.error("Mail sent unsuccessfully!");
    }
  };

  const closeMail = () => {
    setMail(false);
  };

  // current date
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    setFormData((prev) => ({ ...prev, scheDate: today }));
  }, []);

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
          <div className="schedule-box">
            <p
              style={{
                fontSize: "12px",
                textAlign: "center",
                color: "#c1121f",
              }}
            >
              {isNote}
            </p>
            <div className="heading-one">
              <h1 style={{ color: isTheme ? "white" : "#283e46" }}>
                {headings}
              </h1>
              <img
                src={
                  isTheme
                    ? "./src/assets/images/close-circle-dark-svgrepo-com.svg"
                    : "./src/assets/images/close-circle-svgrepo-com.svg"
                }
                width={30}
                alt=""
                onClick={closeModal}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div className="formUI">
              <form action="" className="form-div" onSubmit={sendMail}>
                <div className="current-sch">
                  <label
                    htmlFor="totalNum"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    Total no. of Candidates
                  </label>
                  <input
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                    type="text"
                    name="total_Num"
                    id="totalNum"
                    readOnly
                    // value={countNewAndSubmittedReferrals().counts}
                    value={count}
                  />
                </div>
                <div className="current-sch">
                  <label
                    htmlFor="outNum"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    Number of candidates to send Mail
                  </label>
                  <input
                    style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                    type="number"
                    name="out_Num"
                    id="outNum"
                    value={formData.out_Num}
                    onChange={handleChange}
                    max={count}
                    // max={countNewAndSubmittedReferrals().count}
                    min="1"
                    // onInput={(e) => {
                    //   if (
                    //     e.target.value >
                    //     countNewAndSubmittedReferrals().counts
                    //   ) {
                    //     e.target.value =
                    //       countNewAndSubmittedReferrals().counts;
                    //   }}}
                    onInput={(e) => {
                      //   const maxCount = countNewAndSubmittedReferrals().count;
                      const maxCount = count;

                      e.target.value = e.target.value.replace(/[^0-9]/g, "");

                      // Convert value to number
                      let val = Number(e.target.value);
                      if (val > maxCount) {
                        val = maxCount;
                      }
                      if (val < 1) {
                        val = 1;
                      }
                      e.target.value = val;
                    }}
                  />
                </div>
                <div className="current-sch">
                  {/* <label
                    htmlFor="sche_date"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  > */}
                  {headings !==
                    "Schedule Email to Kindly Notify Candidate of the Decision" && (
                    <>
                      <label
                        htmlFor="sche_date"
                        style={{ color: isTheme ? "white" : "#283e46" }}
                      >
                        {headings ===
                        "Schedule Email to Send Offer Letter to Selected Candidate"
                          ? "Joining Date"
                          : "Interview Scheduled Date"}
                      </label>
                    </>
                  )}

                  {/* {headings ===
                    "Schedule Email to Send Offer Letter to Selected Candidate"
                      ? "Joining Date"
                      : "Interview Scheduled Date"} */}
                  {/* </label> */}
                  {headings ===
                  "Schedule Email to Kindly Notify Candidate of the Decision" ? (
                    <input
                      style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                      type="hidden"
                      name="scheDate"
                      id="sche_date"
                      // min={startFromToday}
                      value={formData.scheDate}
                      // onChange={handleChange}
                    />
                  ) : (
                    <input
                      style={{ color: isTheme ? "#adb5bd" : "#343a40" }}
                      type="date"
                      name="scheDate"
                      id="sche_date"
                      min={startFromToday}
                      value={formData.scheDate}
                      onChange={handleChange}
                    />
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  {isError && (
                    <div className="error-message" style={{ display: "flex" }}>
                      <img
                        src="./src/assets/images/error.svg"
                        width={18}
                        alt=""
                      />
                      {isError}
                    </div>
                  )}
                </div>
                <div className="submit_Section">
                  <button
                    type="button"
                    className="submitButton btn-sub"
                    // onClick={() => mailContent()}
                    onClick={() => mailContent()}
                  >
                    <img src="./src/assets/images/mail.svg" width={20} alt="" />
                    <span>Proceed to Send Mail </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {isMail && (
        <MailContent
          closeMail={closeMail}
          sendMail={sendMail}
          isMailData={isMailData}
        />
      )}
    </>
  );
};

export default ScheduleMail;
