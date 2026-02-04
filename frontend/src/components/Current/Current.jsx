import { useContext, useEffect, useMemo, useState } from "react";
import "./Current.css";
import TableSkeleton from "../AllReferrals/TableSkeleton";
import DataTable from "react-data-table-component";
import ReferralStatus from "../ReferralStatus/ReferralStatus";
import { FaSort } from "react-icons/fa";
import ViewReferral from "../ViewReferral/ViewReferral";
import RateReferral from "../RateReferral/RateReferral";
import EditReferral from "../EditReferral/EditReferral";
import Emailed from "../Emailed/Emailed";
import GroupDiscussions from "../GroupDiscussions/GroupDiscussions";
import Technical from "../Technical/Technical";
import Rejected from "../Rejected/Rejected";
import Selected from "../Selected/Selected";
import FinalHR from "../FinalHR/FinalHR";
import MailContent from "../MailContent/MailContent";
import { useAuth } from "../UserContext/UserContext";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";
import ScheduleMail from "../ScheduleMail/ScheduleMail";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PdfThemeLightIcon from "../../assets/images/pdfLightThemeIcon.svg";
import PdfThemeDarkIcon from "../../assets/images/pdfDarkThemeIcon.svg";
import getInterviewDateColor from "../../utils/getInterviewDateColor";
import MailSentIconImage from "../../assets/images/mailSentIcon.svg";
import MailNotSentIconImage from "../../assets/images/mailNotsentIcon.svg";

const Current = ({ goBackToAllReferrals, value, fetchUsers }) => {
  document.title = "HR Referral Portal | Referral Screening";

  const { authState } = useAuth();
  const userIdAccess = authState?.user?.userId;
  const { isTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  // console.log("user id",referredUserName)
  const [isSchedule, setSchedule] = useState(false);
  const [isDrive, setIsDrive] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentTab, setcurrentTab] = useState(true);
  const [isReferral, setIsReferral] = useState([]);
  const [isReason, setReason] = useState("");
  const [isStartDate, setStartDate] = useState("");
  const [isEndDate, setEndDate] = useState("");
  const [isRate, setRate] = useState(false);
  const [isEdit, setEdit] = useState(false);
  const [selectedReferralTab, setSelectedReferralTab] = useState("all");
  const [selectTab, setselectTab] = useState("All");
  const [childData, setChildData] = useState(true);
  const [referralStatusCount, setReferralStatusCount] = useState({});
  const [is_Error, setIsError] = useState("");
  const [mailBtnDisplay, setMailBtnDisplay] = useState(true);
  const [isNote, setNote] = useState("");
  // const [formData, setFormData] = useState({
  //   out_Num: "",
  //   scheDate: "",
  // });
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1); // 🔁 triggers useEffect in child
  };

  const [isTotal, setTotal] = useState("");
  const [isMail, setMail] = useState(false);
  const [isError, setError] = useState("");
  const [isMailData, setMailData] = useState({});
  const [isSelectedRows, setIsSelectedRows] = useState([]);

  const handleChildData = (valueFromChild) => {
    // console.log("Received from child:", valueFromChild);
    setChildData(valueFromChild);
    // console.log(someProp)
    setcurrentTab(valueFromChild);
  };

  // switch (selectedReferralTab) {
  //   case "emailed":
  //     <Emailed/>
  //   break;
  // }
  // const interviewDateColor  = getInterviewDateColor(referral);

  useEffect(() => {
    fetchCurrent();
  }, []);

  const fetchCurrent = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/currentReferrals",
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (response.status == 403) {
        // console.log("Access Denied!")
        navigate("/*");
        return;
      }
      const data = await response.json();
      // console.log(data.logout,"data")
      if (data.logout) {
        navigate("/referralLogin");
      }
      // console.log("Data fetched:", response.status);
      // const initials = "JD";
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

      // const avatarUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${initials}&backgroundColor=${darkColors.join(",")}&textColor=ffffff`;

      const usersWithAvatars = await Promise.all(
        data.map(async (user) => {
          const initials = user.referral_fname[0] + user.referral_lname[0];
          const backgroundColorParam = darkAvatarColors.join(",");
          try {
            const fetchAvatars = await fetch(
              `https://api.dicebear.com/9.x/initials/svg?seed=${initials}&backgroundColor=${backgroundColorParam}&textColor=ffffff&radius=50&fontSize=44&fontWeight=700`
            );
            const svgText = await fetchAvatars.text();

            const avatarUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
              svgText
            )}`;
            return { ...user, avatarUrl };
          } catch (err) {
            console.error("Error fetching avatar for user", user, err);
            return user;
          }
        })
      );

      const statusCounts = referralCountByStatus(usersWithAvatars);
      // console.log("statusCOunts", statusCounts);

      setUserData(usersWithAvatars);
      setFilteredData(usersWithAvatars);
      setReferralStatusCount(statusCounts);
    } catch (error) {
      console.error("Error fetching data", error);
      // if(response.status)
    } finally {
      setLoading(false);
    }
  };

  const referralCountByStatus = (users) => {
    // console.log("users", users);
    // console.log("users curretRound", users.currentRound);
    console.log("User", users.referral_fname, users.currentRound);
    console.log(
      "Checking Technical:",
      users.currentRound === "Technical Assessment"
    );

    const counts = {};

    users.forEach((user) => {
      if (
        user.currentRound === "Group Discussion" ||
        ((user.status === "Rejected" || user.interviewResult === "Rejected") &&
          user.rejectedIn === "Group Discussion")
      ) {
        // alert("are you coming here1");

        counts["Group Discussion"] = (counts["Group Discussion"] || 0) + 1;
      }
      if (
        user.currentRound === "Technical Assessment" ||
        (user.status === "Rejected" &&
          user.rejectedIn === "Technical Assessment")
      ) {
        counts["Technical Assessment"] =
          (counts["Technical Assessment"] || 0) + 1;
      }
      if (
        user.currentRound === "HR Round" ||
        (user.status === "Rejected" && user.rejectedIn === "HR Round")
      ) {
        // alert("are you coming here");
        counts["HR Round"] = (counts["HR Round"] || 0) + 1;
      }
      if (user.currentRound === "Selected") {
        counts["Selected"] = (counts["Selected"] || 0) + 1;
      }
      if (user.status === "Rejected") {
        counts["Rejected"] = (counts["Rejected"] || 0) + 1;
      }
      // else if(user.currentRound === "Rejected" && user.rejectedIn === "Rejected")

      counts[user.stage] = (counts[user.stage] || 0) + 1;
    });

    return counts;
  };

  // let actionColor;
  const getActionNeed = (
    statusApplication,
    mailStatus,
    rejectedin,
    interviewResult
  ) => {
    // console.log(statusApplication, mailStatus, rejectedin, interviewResult);
    if (statusApplication === "Submitted" && mailStatus === "Not Sent") {
      return {
        label: "Drive invitation pending",
        color: isTheme ? "white" : "#343a40",
      };
    }
    if (
      statusApplication === "Group Discussion" &&
      interviewResult === "Pending"
    ) {
      return { label: "Group Discussion pending", color: "#17a2b8" };
    }
    if (
      statusApplication === "Technical Assessment" &&
      interviewResult === "Pending"
    ) {
      return { label: "Technical round result pending", color: "#007bff" };
    }
    if (statusApplication === "HR Round" && mailStatus === "Not Sent") {
      return { label: "HR invitation to be sent", color: "#fd7e14" };
    }
    if (statusApplication === "HR Round" && mailStatus === "Sent") {
      return { label: "HR review in progress", color: "#fd7e14" };
    }
    if (statusApplication === "Selected" && mailStatus === "Not Sent") {
      return { label: "Offer letter to be sent", color: "#28a745" };
    }
    if (statusApplication === "Selected" && mailStatus === "Sent") {
      return { label: "Offer letter has been sent", color: "#28a745" };
    }

    // if (statusApplication === "Rejected" && mailStatus === "Sent")
    if (statusApplication === "Rejected" && mailStatus === "Sent") {
      // actionColor = "#dc3545";
      // return `No action needed – rejected in ${rejectedin}`;
      return {
        label: `No action needed – rejected in ${rejectedin}`,
        color: "#dc3545",
      };
    }

    if (interviewResult === "Rejected" && mailStatus === "Not Sent") {
      // actionColor = "#dc3545";
      // return `No action needed – rejected in ${rejectedin}`;
      return {
        label: `Rejection email pending – rejected in ${rejectedin}`,
        color: "#dc3545",
      };
    }
    return { label: "—", color: isTheme ? "#b6b6b6" : "#6c757d" }; // Default
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = filteredData.map((row) => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  // cons;
  // const checkboxColumn = {
  //   name: <input type="checkbox" onChange={handleSelectAll} />,
  //   cell: (row) =>
  //     loading ? (
  //       <TableSkeleton />
  //     ) : (
  //       <input
  //         type="checkbox"
  //         checked={selectedRows.includes(row.id)}
  //         onChange={() => handleRowSelect(row.id)}
  //       />
  //     ),
  //   width: "45px",
  //   ignoreRowClick: true,
  //   allowOverflow: true,
  //   button: true,
  // };

  const columns = [
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Name</div>,
      selector: (row) => row.referral_fname + " " + row.referral_lname,
      sortable: true,
      grow: 1,
      minWidth: "200px",
      maxWidth: "300px",
      center: true,
      // textTransform : "capitalize",
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "100%",
              padding: "0.6em 0.9em",
            }}
          >
            <div>
              <img
                src={row.avatarUrl}
                alt="Avatar"
                width="30"
                height="30"
                // style={{ borderRadius: "50%", flexShrink: 0 }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontWeight: 500,
                  fontSize: "1.05em",
                  color: isTheme ? "white" : "#283e46",
                  cursor: "default",
                  textTransform: "capitalize",
                }}
                title={row.referral_fname + " " + row.referral_lname}
              >
                {row.referral_fname + " " + row.referral_lname}
              </span>
              <br />
              <a
                href={`mailto:${row.referral_email}`}
                style={{
                  color: isTheme ? "rgb(144, 224, 239)" : "#653FFD",
                  textDecoration: "none",
                  // color: isTheme ? "rgb(144, 224, 239)" : "#653FFD",
                  textDecoration: "none",
                  whiteSpace: "nowrap", // prevent wrapping
                  overflow: "hidden", // hide overflow
                  textOverflow: "ellipsis", // show ellipsis
                  display: "block", // required for ellipsis to work in inline elements
                  maxWidth: "100%", // restrict the width
                  margin: "3px 0 0 0",
                }}
                title={row.referral_email}
              >
                {row.referral_email}
              </a>
            </div>
          </div>
        ),
    },
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Status</div>,
      selector: (row) =>
        row.rejectedIn
          ? `Rejected in ${row.interviewResult}`
          : row.status || "N/A",
      sortable: true,
      minWidth: "180px",
      maxWidth: "200px",
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              cursor: "default",
              // maxWidth: "200px", minWidth:"180px"
            }}
          >
            <ReferralStatus selectedStatus={row.status} />
          </div>
        ),
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Mail Status</div>
      ),
      selector: (row) => row.mailStatus || "N/A",
      sortable: true,
      minWidth: "50px",
      maxWidth: "120px",
      // center: true,

      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              // width: "100%",
              padding: "0.5em 0",
              color: row.mailStatus === "Sent" ? "#2196F3" : "#FF7F50",
              // color: row.mailStatus === "Sent" ? "blue" : "coral",
              cursor: "default",
            }}
            title={`Mail Status: ${row.mailStatus || "N/A"}`}
          >
            <div
              style={{
                borderRadius: "50%",
                // width: "20px",
                // height: "20px",
                background: row.mailStatus === "Sent" ? "#e7f4fe" : "#ffece5",
                display: "flex", // enables flexbox
                justifyContent: "center", // centers horizontally
                alignItems: "center", // centers vertically
              }}
            >
              <img
                src={
                  row.mailStatus === "Sent"
                    ? MailSentIconImage
                    : MailNotSentIconImage
                }
                className="mailIcons"
              />
            </div>
            <ReferralStatus selectedStatus={row.mailStatus} />
          </div>
        ),
    },

    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Resume</div>,
      sortable: true,
      center: true,
      minWidth: "50px",
      maxWidth: "120px",
      cell: (row) => {
        if (loading) return <TableSkeleton />;
        if (row.resume_file?.data) {
          const byteArray = new Uint8Array(row.resume_file.data.data);
          const blob = new Blob([byteArray], {
            type: row.resume_file.mimetype,
          });
          const url = URL.createObjectURL(blob);

          return (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              // style={{
              //   color: "#653FFD",
              //   textDecoration: "none",
              //   wordBreak: "break-word",
              // }}
              // title={row.resume_file.filename}
            >
              <img
                src={isTheme ? PdfThemeDarkIcon : PdfThemeLightIcon}
                alt=""
                className="pdfImage"
              />
              {/* {row.resume_file.filename} */}
            </a>
          );
        }
        return <div style={{ textAlign: "center" }}>N/A</div>;
      },
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Interview Date</div>
      ),
      selector: (row) => row.roundDate || "",
      sortable: true,
      minWidth: "150px",
      cell: (row) => {
        const interviewDateColor = getInterviewDateColor(row);

        if (loading) return <TableSkeleton />;
        if (!row.roundDate)
          return <div style={{ textAlign: "center", width: "100%" }}>-</div>;
        const date = new Date(row.roundDate);
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
        return (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              // color: interviewDateColor,
              cursor: "default",

              // color: row.status === "Rejected" ? "#dc3545" : "inherit",
              // textDecoration:
              //   row.status === "Rejected" ? "line-through" : "none",
            }}
          >
            {formattedDate}
          </div>
        );
      },
    },
    // {
    //   name: (
    //     <div style={{ textAlign: "center", width: "100%" }}>Referred By</div>
    //   ),
    //   selector: (row) => row.referredBy || "N/A",
    //   sortable: true,
    //   cell: (row) =>
    //     loading ? (
    //       <TableSkeleton />
    //     ) : (
    //       <div style={{ textAlign: "center", width: "100%" }}>
    //         {row.referredBy || "N/A"}
    //       </div>
    //     ),
    // },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Action Needed</div>
      ),
      sortable: true,
      cell: (row) => {
        if (loading) return <TableSkeleton />;
        const { label, color } = getActionNeed(
          row.status,
          row.mailStatus,
          row.rejectedIn,
          row.interviewResult
        );
        return (
          <div
            style={{
              textAlign: "center",
              color,
              width: "100%",
              whiteSpace: "nowrap", // no line breaks
              overflow: "hidden", // hide overflow
              textOverflow: "ellipsis", // show ...
              display: "block",
              maxWidth: "100%",
              cursor: "default",
            }}
            title={label}
          >
            {label}
          </div>
        );
      },
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Referred Date</div>
      ),
      id: "updatedAt",

      selector: (row) => row.created_at,
      sortable: true,
      center: true,
      cell: (row) => {
        if (loading) return <TableSkeleton />;
        const date = new Date(row.created_at);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-GB", { month: "short" });
        const year = date.getFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        return (
          <div
            style={{ textAlign: "center", width: "100%", cursor: "default" }}
          >
            {formattedDate}
          </div>
        );
      },
    },
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Actions</div>,
      center: true,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
            }}
          >
            <button
              title="View"
              onClick={() => viewReferral(row)}
              className="action-buttons"
            >
              <img src="./src/assets/images/view.svg" alt="view" width={20} />
            </button>
            <button
              title="Edit"
              onClick={() => editReferral(row)}
              className="action-buttons"
              disabled={row.interviewResult === "Rejected" && row.mailStatus === "Sent"}

            >
              <img src="./src/assets/images/edit.svg" alt="edit" width={20} />
            </button>
            <button
              title="Rate"
              onClick={() => rateReferral(row)}
              className="action-buttons"
            >
              <img
                src="./src/assets/images/rating.svg"
                alt="rating"
                width={20}
              />
            </button>
          </div>
        ),
    },
  ];

  // const columns = [checkboxColumn, ...columnsReferrals];
  const viewReferral = (row) => {
    setcurrentTab(false);
    setIsReferral(row);
    // console.log("hello", childData);
    setChildData(true);
  };

  useEffect(() => {
    // console.log(isReferral, "isReferral");
  }, [isReferral]);

  const scheduleMail = (referral) => {
    // alert("hello")
    setSchedule(true);
  };

  const selectedData = (selectData) => {
    console.log("hr", selectData);
    setIsSelectedRows(selectData);
  };

  // console.log(selectedReferralTab);
  const countNewAndSubmittedReferrals = (
    selectedReferralTab,
    isSelectedRows = []
  ) => {
    // console.log("1", selectedReferralTab);
    console.log("Selected Rows for mail:", isSelectedRows);
    console.log("Selected tab for mail:", selectedReferralTab);
    let selectedReferralTabMail;
    if (selectedReferralTab === "all") {
      selectedReferralTab = "Submitted";
      selectedReferralTabMail = "Not Sent";
      // console.log(selectedReferralTab, "selectedReferralTab");
    } else if (selectedReferralTab !== "all") {
      selectedReferralTabMail = "Not Sent";
      // console.log(selectedReferralTab, "selectedReferralTab");
    }

    if (!userData || userData.length === 0) {
      console.log("userData not available.");
      return { counts: 0, ids: [], roles: [] };
    }
    // console.log("2", selectedReferralTab);
    const dataToFilter = isSelectedRows.length > 0 ? isSelectedRows : userData;
    // console.log(dataToFilter, "filtered data");
    const count = dataToFilter.filter(
      // console.log("Referral", referral)
      // (referral) => referral.stage === "New" && referral.status === "emailed"
      (referral) =>
        referral.stage === "New" &&
        referral.mailStatus === selectedReferralTabMail &&
        referral.status === selectedReferralTab
    );
    console.log("Count of new and submitted referrals:", count);
    console.log("Count of new and selected tab:", selectedReferralTab);
    // if (count.length === 0 && selectedReferralTab == "all") {
    //   console.log("empty");
    //   setNote(
    //     `Emails will be sent only for referrals with a 'Submitted' status.`
    //   );
    // }

    // if (count == []) {
    //   console.log("empty");
    // }

    // const referralIds = count.map((referral) => referral._id);
    // // console.log(referralIds);
    // const idsString = referralIds.join(",");
    // // console.log(idsString);
    // return {
    //   counts: count.length,
    //   ids: referralIds,
    // };
    const idRolePairs = count.map((referral) => ({
      id: referral._id,
      role: referral.role_applied || "Not Specified",
    }));

    // console.log(referralIds);
    // const idsString = referralIds.join(",");
    // console.log(idsString);
    return {
      counts: count.length,
      ids: idRolePairs.map((item) => item.id),
      roles: idRolePairs, // Contains both ID and role
    };
  };

  useEffect(() => {
    console.log("Updated selected rows:", isSelectedRows);
    console.log("Updated tab:", selectedReferralTab);
    const result = countNewAndSubmittedReferrals(
      selectedReferralTab,
      isSelectedRows
    );
    console.log("total ids of the selected ", result);
  }, [isSelectedRows, selectedReferralTab]);

  //   const countNewAndSubmittedReferrals = (selectedReferralTab, isSelectedRows = []) => {
  //   console.log("Selected Rows for mail:", isSelectedRows);

  //   let selectedReferralTabMail = "Not Sent";
  //   if (selectedReferralTab === "all") selectedReferralTab = "Submitted";

  //   let dataToFilter = isSelectedRows.length > 0 ? isSelectedRows : userData;

  //   const count = dataToFilter.filter(
  //     (referral) =>
  //       referral.stage === "New" &&
  //       referral.mailStatus === selectedReferralTabMail &&
  //       referral.status === selectedReferralTab
  //   );

  //   const idRolePairs = count.map((referral) => ({
  //     id: referral._id,
  //     role: referral.role_applied || "Not Specified",
  //   }));

  //   return {
  //     counts: count.length,
  //     ids: idRolePairs.map((item) => item.id),
  //     roles: idRolePairs,
  //   };
  // };

  const { counts, ids, roles } = countNewAndSubmittedReferrals(
    selectedReferralTab,
    isSelectedRows
  );

  useEffect(() => {
    // console.log(counts, "function");
    // console.log(selectedReferralTab, "function tab");

    if (selectedReferralTab === "all") {
      // console.log("submitted");
      setNote(
        "Emails will be sent only for referrals with a 'Submitted' status."
      );
    } else if (
      selectedReferralTab === "HR Round" ||
      selectedReferralTab === "Selected" ||
      selectedReferralTab === "Rejected"
    ) {
      setNote(
        "Emails will be sent only for referrals with a 'Not Sent' Mail Status."
      );
    } else {
      setNote(""); // Clear note if condition doesn't match
    }
  }, [counts, selectedReferralTab]);

  // useEffect(() => {
  //   console.log(selectedReferralTab,"submitted counts")
  //   if (counts === 0 && selectedReferralTab=== "Submitted") {
  //     console.log("submitted")
  //     setNote(
  //       "Emails will be sent only for referrals with a 'Submitted' status."
  //     );
  //   } else {
  //     setNote(""); // Clear note if condition doesn't match
  //   }
  // }, [counts, selectedReferralTab]);

  // const { counts, ids, roles } = useMemo(() => {
  //   console.log(isSelectedRows, "sending to mail");
  //   console.log(selectedReferralTab, "sending to mail in tab");
  //   return countNewAndSubmittedReferrals(selectedReferralTab, isSelectedRows);
  // }, [selectedReferralTab, isSelectedRows]);

  const driveComplete = () => {
    setIsDrive(true);
  };

  const closeModal = () => {
    setIsDrive(false);
    setSchedule(false);
    setRate(false);
    setEdit(false);
  };

  const closeMail = () => {
    setMail(false);
  };

  // useEffect(() => {
  //     if (searchQuery === "") {
  //       setFilteredData(userData);
  //     } else {
  //       const filtered = userData.filter(
  //         (user) =>
  //           user.referral_fame
  //             ?.toLowerCase()
  //             .includes(searchQuery.toLowerCase()) ||
  //           user.referral_email
  //             ?.toLowerCase()
  //             .includes(searchQuery.toLowerCase()) ||
  //           user.role_applied?.toLowerCase().includes(searchQuery.toLowerCase())
  //       );
  //       setFilteredData(filtered);
  //     }
  //   }, [searchQuery, userData]);

  const displayRows = Array.from({ length: 3 }, () => ({}));

  const customStyles = {
    table: {
      style: {
        width: "100%",
        backgroundColor: "#f8f8f8",
        border: isTheme ? "1px solid #6c757d" : "1px solid #ddd", // border around the whole table container
      },
    },
    headRow: {
      style: {
        color: isTheme ? "white" : "#283e46",
        backgroundColor: isTheme ? "#495057" : "#fff",

        fontSize: "1.2em",
        // fontWeight: "bold",
        minHeight: "56px",
        // textAlign: "center"
      },
    },
    header: {
      style: {
        // backgroundColor: "red",
        color: "#333",
        fontWeight: "bold",
      },
    },
    headCells: {
      style: {
        whiteSpace: "normal",
        wordBreak: "break-word",
        // textAlign: "center", // optional
        fontSize: "1em",
        // minHeight: '56px',
        paddingLeft: "8px",
        paddingRight: "8px",
        fontWeight: "600",
        borderRight: "1px solid #6c757d", // Light row divider
        // borderRight: "1px solid #d8d8d8", // Light row divider
        border: isTheme ? "1px solid #6c757d" : "1px solid #d8d8d8",
        backgroundColor: isTheme ? "#212529" : "#e9ecef", // Optional light background
        // backgroundColor: "#f2f2f2",
        //       borderRight: '0.5 px solid #ccc', // Only affects header
        // backgroundColor: "#d9d9d9"
      },
    },
    rows: {
      style: {
        minHeight: "48px",
        fontSize: "0.8em",
        // borderRight: "1px solid #e0e0e0", // Light grey border

        color: isTheme ? "white" : "#333",
        // backgroundColor: isTheme ? "#343a40" : "#fff",
        // borderBottom: "1px solid #ddd",
        // "&:nth-of-type(odd)": {
        // backgroundColor: isTheme ? "#343a40" : "#f8f9fa",
        // },
        // "&:nth-of-type(even)": {
        backgroundColor: isTheme ? "#343a40" : "#fff",
        // backgroundColor: isTheme ? "#495057" : "#fff",
        // },
      },
    },
    pagination: {
      style: {
        backgroundColor: isTheme ? "black" : "#fff",
        color: isTheme ? "white" : "black",
      },
    },
    cells: {
      style: {
        paddingLeft: "10px",
        paddingRight: "10px",
        color: isTheme ? "white" : "#283e46",
        // borderRight: "1px solid #d8d8d8", // Light row divider
        borderRight: isTheme ? "1px solid #6c757d" : "1px solid #d8d8d8", // Light row divider
        borderBottom: isTheme ? "1px solid #6c757d" : "none", // Light row divider
        // borderRight: "1px solid #f0f0f0", // Light row divider

        // whiteSpace: 'normal', wordBreak: 'break-word', textAlign: 'center'
      },
    },
  };

  const handleCompleteClick = async () => {
    if (isReason === "" || userIdAccess == "") {
      setIsError("Enter the feedback for the Drive Completion.");
    }
    const drive_data = {
      reason: isReason,
      completedBy: userIdAccess,
      // drive_start: isStartDate,
      // drive_end: isEndDate,
    };
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/driveComplete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(drive_data),
        }
      );
      // console.log(response);

      if (response.ok) {
        const driveComplete = await response.json();
        // console.log("Drive completion reason:", driveComplete);
        const updateReferralStatusResponse = await fetch(
          "http://localhost:3000/api/v1/referral/updateallReferrals",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              newStatus: "Old", // Changing the status to 'old'
            }),
          }
        );
        toast.success("Drive Completed");
        fetchCurrent();
        // console.log(updateReferralStatusResponse);
        if (updateReferralStatusResponse.ok) {
          // toast.success("Drive Completed");
          console.log("Referral stages updated successfully.");
        } else {
          console.log("Error updating referral stages.");
          // toast.error("Error changing Drive Status");
        }
        setReason("");
        setStartDate("");
        setEndDate("");
        closeDrive();
      } else {
        console.log("Error: ", response.status);
      }
    } catch (error) {
      console.log(error.name);
      console.log(error.message);
    }
  };

  const closeDrive = () => {
    setReason("");
    setStartDate("");
    setEndDate("");
    setIsError("");
    setIsDrive(false);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  // switch (selectedReferralTab) {
  //   case "emailed":
  //     headings = "Schedule Email for Group Discussion";
  //     break;
  //   case "groupdiscussion":
  //     headings = "Schedule Email for Technical";
  //     break;
  //   case "technical":
  //     headings = "Schedule Email for Final HR";
  //     break;
  //   case "final_hr":
  //     headings = "Schedule Email for Final HR Discussion";
  //     break;
  //   case "rejected":
  //     headings = "Schedule Email to Kindly Notify Candidate of the Decision";
  //     break;
  //   case "selected":
  //     headings = "Schedule Email to Send Offer Letter to Selected Candidate";
  //     break;
  //   // Add more cases if needed
  //   default:
  //     headings = "";
  // }

  // const handleDateChange = (e) => {
  //   if (e.target.id === "start-date") {
  //     setStartDate(e.target.value);
  //   } else if (e.target.id === "end-date") {
  //     setEndDate(e.target.value);
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  //   // if (name === "out_Num") {
  //   //   const numericValue = Math.min(
  //   //     Number(value),
  //   //     countNewAndSubmittedReferrals().counts
  //   //   );
  //   //   console.log(numericValue);
  //   // }
  //   if (name === "out_Num") {
  //     const { counts, ids } = countNewAndSubmittedReferrals();

  //     let numericValue = Number(value);

  //     // Ensure the numeric value doesn't exceed the available referral count
  //     if (numericValue > counts) {
  //       numericValue = counts;
  //     }

  //     console.log("Requested number of IDs:", numericValue);

  //     // Take exactly 'numericValue' number of IDs from the array
  //     const selectedIds = ids.slice(0, numericValue);

  //     console.log("Selected referral IDs:", selectedIds);

  //     // Update the form data with the numeric value and the selected IDs
  //     setFormData({
  //       ...formData,
  //       [name]: numericValue, // Store the numeric value entered by the user
  //       selectedReferralIds: selectedIds.join(","), // Store the actual selected referral IDs as a comma-separated string
  //     });
  //   }
  // };

  // const mailContent = () => {
  //   if (formData.scheDate && formData.selectedReferralIds) {
  //     setMail(true);
  //   } else {
  //     setError("Please enter the values!");
  //   }
  // };

  // const sendMail = async (mailContentData) => {
  //   // e.preventDefault();

  //   const mailData = {
  //     scheduleDate: formData.scheDate,
  //     // totalCandidates: countNewAndSubmittedReferrals().ids,
  //     totalCandidates: formData.selectedReferralIds,
  //     mailSent: new Date(),
  //     sentBy: userIdAccess,
  //     ...mailContentData,
  //   };
  //   try {
  //     const response = await fetch(
  //       "http://localhost:3000/api/v1/referral/scheduleOne",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(mailData),
  //       }
  //     );
  //     if (response.ok) {
  //       setFormData("");
  //       closeModal();
  //       setMail(false);
  //       fetchCurrent();
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const backToCurrent = () => {
    setcurrentTab(true);
  };

  const editReferral = (row) => {
    setEdit(true);
    setIsReferral(row);
    // console.log("Edit Referral at", row._id);
  };

  const rateReferral = (row) => {
    setRate(true);
    setIsReferral(row);
    // console.log("Rate Referral");
  };

  const getMail = async (mail) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/referral/mail/${mail}`
      );
      // console.log(response);
      const data = await response.json();
      if (response.ok) {
        setMailData(data);
      }
      // console.log(data);
    } catch (error) {
      console.error(error.name, ":", error.message);
    }
  };

  useEffect(() => {
    if (selectedReferralTab === "all") {
      getMail("All");
    }
  }, [selectedReferralTab]);

  return (
    <>
      {/* {selectedReferralTab === "all" && ()} */}
      <div className="main-container">
        <ReferralSidebar />
        <div className="main-content">
          {/* <div className="table-container"> */}
          <div className="container-current">
            {currentTab ? (
              <div className="right-content-usermanagement">
                <div className="user-management-section-one">
                  <div className="pageHeadings">
                    {/* <span className="referralIcon icon"></span> */}
                    <span
                      className={`referralIcon icon referralIcon-${
                        isTheme ? "dark" : "light"
                      }`}
                    ></span>
                    {/* <h4 onClick={goBackToAllReferrals} style={{ cursor: "pointer" }}> */}
                    <h4
                      style={{
                        cursor: "pointer",
                        color: isTheme ? "white" : "#283e46",
                      }}
                      onClick={() => {
                        goBackToAllReferrals();
                        fetchUsers();
                      }}
                    >
                      Referrals
                    </h4>
                    <img
                      src={
                        isTheme
                          ? "./src/assets/images/breadcrumbs-dark-svgrepo-com.svg"
                          : "./src/assets/images/breadcrumbs-svgrepo-com.svg"
                      }
                      width={18}
                      className="user-management-bread-crumbs"
                    />
                    <span className="sub-dept sub-dept-user currentAction">
                      Current
                    </span>
                  </div>
                  <div className="lastBtns">
                    <div className="img-btn" onClick={driveComplete}>
                      <img
                        src="./src/assets/images/completeDrive.svg"
                        width={20}
                        alt=""
                      />
                      <h1>Drive Status</h1>
                    </div>
                    {mailBtnDisplay ? (
                      <div
                        className="img-btn"
                        onClick={() => {
                          scheduleMail(userData);
                          countNewAndSubmittedReferrals();
                        }}
                      >
                        <img
                          src="./src/assets/images/schedule.svg"
                          width={20}
                          alt=""
                        />
                        <h1>Schedule</h1>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div>
                  <div className="tabs-container-users">
                    {/* <div className="leftSideButtons">
                      <button
                        onClick={goBackToAllReferrals}
                        // onClick={() => {
                        //   setselectTab("All");
                        // }}
                        // className={`${
                        //   selectTab === "All" ? "active-tab" : ""
                        // }`}
                      >
                        <span
                        // className={`${
                        //   selectTab === "All" ? "tabIcon iconTab" : " "
                        // } `}
                        ></span>
                        All
                      </button>
                      <button
                        className="active-tab"
                        // onClick={() => {
                        //   setselectTab("Current");
                        // }}
                      >
                        <span className="tabIcon iconTab"></span>
                        Current
                      </button>
                    </div> */}
                    {/* <div className="rightSideButtons"></div> */}

                    {/* <h1 onClick={changeTab}>Current</h1>
                    {currentTab && <Current />}
                      <Link to="/current">
                        <h1>Current</h1>
                      </Link> */}
                  </div>
                  {/* SelectedReferralTabs */}
                  <div className="currentTabSecondSec">
                    <div className="currentTabsAllEmailed tabsAndViewUsers">
                      <button
                        onClick={() => {
                          setSelectedReferralTab("all");
                          getMail("All");
                          setMailBtnDisplay(true);
                        }}
                        className={
                          selectedReferralTab === "all" ? "active-tab" : ""
                        }
                      >
                        <span>All</span>
                        <span className="counts">
                          {referralStatusCount["New"] || 0}
                        </span>
                      </button>
                      {/* <button
                        onClick={() => {
                          setSelectedReferralTab("Emailed");
                        }}
                        className={
                          selectedReferralTab === "Emailed" ? "allEmailed" : ""
                        }
                      >
                        Emailed
                        <span className="counts">
                          {referralStatusCount["Emailed"] || 0}
                        </span>
                      </button> */}
                      <button
                        onClick={() => {
                          setSelectedReferralTab("Group Discussion");
                          // getMail("Group Discussion");
                          setMailBtnDisplay(false);
                        }}
                        className={
                          selectedReferralTab === "Group Discussion"
                            ? "group_discussion"
                            : ""
                        }
                      >
                        Group Discussion
                        <span className="counts">
                          {referralStatusCount["Group Discussion"] || 0}
                        </span>{" "}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReferralTab("Technical Assessment");
                          // getMail("Technical Assessment");
                          setMailBtnDisplay(false);
                        }}
                        className={
                          selectedReferralTab === "Technical Assessment"
                            ? "technicalStatus"
                            : ""
                        }
                      >
                        Technical
                        <span className="counts">
                          {referralStatusCount["Technical Assessment"] || 0}
                        </span>{" "}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReferralTab("HR Round");
                          getMail("HR Round");
                          setMailBtnDisplay(true);
                        }}
                        className={
                          selectedReferralTab === "HR Round" ? "hrRound" : ""
                        }
                      >
                        Final HR
                        <span className="counts">
                          {referralStatusCount["HR Round"] || 0}
                        </span>{" "}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReferralTab("Selected");
                          getMail("Selected");
                          setMailBtnDisplay(true);
                        }}
                        className={
                          selectedReferralTab === "Selected" ? "selected" : ""
                        }
                      >
                        Selected
                        <span className="counts">
                          {referralStatusCount["Selected"] || 0}
                        </span>{" "}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReferralTab("Rejected");
                          getMail("Rejected");
                          setMailBtnDisplay(true);
                        }}
                        className={
                          selectedReferralTab === "Rejected" ? "rejected" : ""
                        }
                      >
                        Rejected
                        <span className="counts">
                          {referralStatusCount["Rejected"] || 0}
                        </span>{" "}
                      </button>
                    </div>
                    <div className="search-container">
                      <input
                        type="text"
                        className="searchField"
                        placeholder="Search by name, email, or role"
                        style={{ color: isTheme ? "white" : "black" }}
                        // value={searchQuery}
                        // onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="btn-set">
                    {/* <div className="img-btn" onClick={driveComplete}>
                <img
                  src="./src/assets/images/completeDrive.svg"
                  width={20}
                  alt=""
                />
                <h1>Complete Drive</h1>
              </div>
              <div className="img-btn" onClick={scheduleMail}>
                <img src="./src/assets/images/schedule.svg" width={20} alt="" />
                <h1>Schedule</h1>
              </div> */}
                    {isDrive && (
                      <div className="modal-overlay">
                        <div
                          className="modal-box"
                          style={{
                            backgroundColor: isTheme ? "black" : "white",
                            border: isTheme
                              ? "1px solid #8d8d8d"
                              : "1px solid white",
                          }}
                        >
                          <div className="schedule-box">
                            <div className="heading-one">
                              <h1
                                style={{ color: isTheme ? "white" : "#283e46" }}
                              >
                                Drive Completion Confirmation
                              </h1>
                              <img
                                src={
                                  isTheme
                                    ? "./src/assets/images/close-circle-dark-svgrepo-com.svg"
                                    : "./src/assets/images/close-circle-svgrepo-com.svg"
                                }
                                width={30}
                                alt=""
                                onClick={closeDrive}
                                style={{ cursor: "pointer" }}
                              />
                            </div>
                            <div className="drive-reason">
                              <p
                                style={{ color: isTheme ? "white" : "#283e46" }}
                              >
                                Are you sure you want to end the Drive?
                              </p>

                              <textarea
                                style={{
                                  color: isTheme ? "#adb5bd" : "#343a40",
                                }}
                                name=""
                                id=""
                                className="dri-rea"
                                onChange={handleReasonChange}
                                value={isReason}
                              ></textarea>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                {is_Error && (
                                  <div
                                    className="error-message"
                                    style={{ display: "flex" }}
                                  >
                                    <img
                                      src="./src/assets/images/error.svg"
                                      width={18}
                                      alt=""
                                      style={{ marginBottom: "5px" }}
                                    />
                                    {is_Error}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="button-hire">
                              <button
                                className="cancel-btn"
                                type="button"
                                onClick={closeDrive}
                              >
                                <span className="cancel_btn cancel_icon_align "></span>
                                Cancel
                              </button>
                              <button
                                className="submitButton"
                                type="submit"
                                onClick={handleCompleteClick}
                              >
                                <span className="submit_btn submit_icon_align"></span>
                                Complete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {isSchedule && (
                      <ScheduleMail
                        isMailData={isMailData}
                        closeModal={closeModal}
                        count={counts}
                        id_referral={ids}
                        role_id={roles}
                        roundTypeForEmail={selectedReferralTab}
                        fetchCurrent={fetchCurrent}
                        isNote={isNote}
                        refreshData={triggerRefresh} //  pass here
                      />
                      // <div className="modal-overlay">
                      //   <div className="modal-box">
                      //     <div className="schedule-box">
                      //       <div className="heading-one">
                      //         <h1>Schedule Mail for Group Discussion</h1>
                      //         <img
                      //           src="./src/assets/images/close-circle-svgrepo-com.svg"
                      //           width={30}
                      //           alt=""
                      //           onClick={closeModal}
                      //         />
                      //       </div>

                      //       <div className="formUI">
                      //         <form
                      //           action=""
                      //           className="form-div"
                      //           // onSubmit={sendMail}
                      //         >
                      //           <div className="current-sch">
                      //             <label htmlFor="totalNum">
                      //               Total no. of Candidates
                      //             </label>
                      //             <input
                      //               type="text"
                      //               name="total_Num"
                      //               id="totalNum"
                      //               readOnly
                      //               value={
                      //                 countNewAndSubmittedReferrals().counts
                      //               }
                      //             />
                      //           </div>
                      //           <div className="current-sch">
                      //             <label htmlFor="outNum">
                      //               Number of candidates to send Mail
                      //             </label>
                      //             <input
                      //               type="number"
                      //               name="out_Num"
                      //               id="outNum"
                      //               value={formData.out_Num}
                      //               onChange={handleChange}
                      //               max={countNewAndSubmittedReferrals().count}
                      //               min="1"
                      //               // onInput={(e) => {
                      //               //   if (
                      //               //     e.target.value >
                      //               //     countNewAndSubmittedReferrals().counts
                      //               //   ) {
                      //               //     e.target.value =
                      //               //       countNewAndSubmittedReferrals().counts;
                      //               //   }}}
                      //               onInput={(e) => {
                      //                 const maxCount =
                      //                   countNewAndSubmittedReferrals().count;

                      //                 e.target.value = e.target.value.replace(
                      //                   /[^0-9]/g,
                      //                   ""
                      //                 );

                      //                 // Convert value to number
                      //                 let val = Number(e.target.value);
                      //                 if (val > maxCount) {
                      //                   val = maxCount;
                      //                 }
                      //                 if (val < 1) {
                      //                   val = 1;
                      //                 }
                      //                 e.target.value = val;
                      //               }}
                      //             />
                      //           </div>
                      //           <div className="current-sch">
                      //             <label htmlFor="sche_date">
                      //               Scheduled Date
                      //             </label>
                      //             <input
                      //               type="date"
                      //               name="scheDate"
                      //               id="sche_date"
                      //               value={formData.scheDate}
                      //               onChange={handleChange}
                      //             />
                      //           </div>
                      //           <div>
                      //             {isError && (
                      //               <div className="error-message">
                      //                 {isError}
                      //               </div>
                      //             )}
                      //           </div>
                      //           <div className="submit_Section">
                      //             <button
                      //               type="button"
                      //               className="submitButton btn-sub"
                      //               // onClick={() => mailContent()}
                      //               onClick={() => mailContent()}
                      //             >
                      //               <img
                      //                 src="./src/assets/images/mail.svg"
                      //                 width={20}
                      //                 alt=""
                      //               />
                      //               <span>Proceed to Send Mail </span>
                      //             </button>
                      //           </div>
                      //         </form>
                      //       </div>
                      //     </div>
                      //   </div>
                      // </div>
                    )}
                    {/* {isMail && (
                      <MailContent closeMail={closeMail} sendMail={sendMail} />
                    )} */}
                    {isRate && (
                      <RateReferral
                        referral={isReferral}
                        closeModal={closeModal}
                        fetchCurrent={fetchCurrent}
                      />
                    )}
                    {isEdit && (
                      <EditReferral
                        referral={isReferral}
                        closeModal={closeModal}
                        fetchCurrent={fetchCurrent}
                      />
                    )}
                  </div>

                  {/* Loading state conditional */}
                  {selectedReferralTab === "all" && (
                    <>
                      <div
                        className={`custom-table-wrapper theme-change-${
                          isTheme ? "dark" : "theme"
                        }`}
                        style={{
                          "--pagination-icon-color": isTheme
                            ? "white"
                            : "black",
                          "--pagination-icon-disabled-color": isTheme
                            ? "#adb5bd"
                            : "#ccc",
                          "--pagination-bg": isTheme ? "#495057" : "#fff",
                          "--pagination-text-color": isTheme
                            ? "white"
                            : "black",
                        }}
                      >
                        {loading ? (
                          <DataTable
                            columns={columns}
                            data={displayRows}
                            customStyles={customStyles}
                            pagination
                            selectableRows={false}
                          />
                        ) : (
                          <div className="custom-table-wrapper">
                            <DataTable
                              customStyles={customStyles}
                              columns={columns}
                              data={filteredData}
                              pagination
                              responsive
                              selectableRows
                              // striped
                              sortIcon={<FaSort />}
                              defaultSortFieldId="updatedAt"
                              defaultSortAsc={false}
                              onSelectedRowsChange={(state) => {
                                console.log(
                                  "Selected Rows:",
                                  state.selectedRows
                                ); // 🔹 Callback when selected rows change (returns selected rows)
                                setIsSelectedRows(state.selectedRows);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              childData && (
                // When currentTab is false AND valueFromChild is  "false"

                <ViewReferral
                  referral={isReferral}
                  goBackToAllReferrals={goBackToAllReferrals}
                  backToCurrent={backToCurrent}
                />
              )
            )}

            {/* </div> */}
            {selectedReferralTab === "Emailed" && (
              <Emailed
                // someProp={false}
                sendDataToParent={handleChildData}
                referral={isReferral}
                statusValue="Emailed"
                // valueToSendMail = "group_discussion"

                // backToCurrent={backToCurrent}
              />
            )}
            {selectedReferralTab === "Group Discussion" && (
              <GroupDiscussions
                sendDataToParent={handleChildData}
                referral={isReferral}
                statusValue="Group Discussion"
                fetchCurrent={fetchCurrent}
              />
            )}
            {selectedReferralTab === "Technical Assessment" && (
              <Technical
                sendDataToParent={handleChildData}
                referral={isReferral}
                statusValue="Technical Assessment"
                fetchCurrent={fetchCurrent}
              />
            )}
            {selectedReferralTab === "HR Round" && (
              <FinalHR
                sendDataToParent={handleChildData}
                referral={isReferral}
                statusValue="HR Round"
                fetchCurrent={fetchCurrent}
                selectedData={selectedData}
                refreshKey={refreshKey} //
              />
            )}
            {selectedReferralTab === "Selected" && (
              <Selected
                sendDataToParent={handleChildData}
                referral={isReferral}
                statusValue="Selected"
                fetchCurrent={fetchCurrent}
                selectedData={selectedData}
                refreshKey={refreshKey} //
              />
            )}
            {selectedReferralTab === "Rejected" && (
              <Rejected
                sendDataToParent={handleChildData}
                referral={isReferral}
                statusValue="Rejected"
                fetchCurrent={fetchCurrent}
                selectedData={selectedData}
                refreshKey={refreshKey} //
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Current;
