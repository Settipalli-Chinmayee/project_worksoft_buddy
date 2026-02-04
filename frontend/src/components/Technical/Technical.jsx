import { useContext, useEffect, useState } from "react";
// import "./current.css";
import TableSkeleton from "../AllReferrals/TableSkeleton";
import DataTable from "react-data-table-component";
import ReferralStatus from "../ReferralStatus/ReferralStatus";
import { FaSort } from "react-icons/fa";
import ViewReferral from "../ViewReferral/ViewReferral";
import RateReferral from "../RateReferral/RateReferral";
import EditReferral from "../EditReferral/EditReferral";
// import Emailed from "../Emailed/Emailed";
import Rejected from "../Rejected/Rejected";
import Selected from "../Selected/Selected";
import FinalHR from "../FinalHR/FinalHR";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import getInterviewDateColor from "../../utils/getInterviewDateColor";
import PdfThemeLightIcon from "../../assets/images/pdfLightThemeIcon.svg";
import PdfThemeDarkIcon from "../../assets/images/pdfDarkThemeIcon.svg";
import PendingIcon from "../../assets/images/pendingImageTable.svg";
import RejectedIcon from "../../assets/images/rejectedStatus.svg";
import { useReferral } from "../ReferralContext/ReferralContext";
// import MailSentIcon from "../../assets/images/mailSentIcon.svg";
// import MailNotSentIcon from "../../assets/images/mailNotsentIcon.svg";
// //

const Technical = ({
  goBackToAllReferrals,
  value,
  someProp,
  sendDataToParent,
  referral,
  statusValue,
  fetchCurrent,
}) => {
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
  const [viewEmailed, setViewEmailed] = useState(false);
  const { isTheme } = useContext(ThemeContext);
  // console.log("onSendData ",tabBoolean);
  // switch (selectedReferralTab) {
  //   case "emailed":
  //     <Emailed/>
  //   break;
  // }
  // alert("emailed Tab", currentTab)
  // console.log("all referral", referral);
  useEffect(() => {
    // alert("here");
    fetchCurrentTable();
  }, []);
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

  const fetchCurrentTable = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/currentReferrals",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log("Data fetched:", data);
      let referralListByStatus = data.filter((referrals) => {
        return (
          referrals.status === statusValue ||
          (referrals.status === "Rejected" &&
            referrals.rejectedIn === "Technical Assessment")
        );
      });
      const usersWithAvatars = await Promise.all(
        referralListByStatus.map(async (user) => {
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
      setUserData(usersWithAvatars);
      setFilteredData(usersWithAvatars);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = filteredData.map((row) => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  const columns = [
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Name</div>,
      selector: (row) => row.referral_fname + " " + row.referral_lname,
      sortable: true,
      grow: 0,
      minWidth: "250px",
      maxWidth: "500px",
      center: true,

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
                  textTransform: "capitalize",
                  fontWeight: 500,
                  fontSize: "1.05em",
                  color: isTheme ? "white" : "#283e46",
                  cursor: "default",
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
    // {
    //   name: (
    //     <div style={{ textAlign: "center", width: "100%" }}>Department</div>
    //   ),
    //   selector: (row) => row.department || "N/A",
    //   sortable: true,
    //   wrap: true,
    //   minWidth: "120px",
    // },
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
        <div style={{ textAlign: "center", width: "100%" }}>Employee Type</div>
      ),
      selector: (row) => row.employment_type || "N/A",
      sortable: true,
      center: true,

      minWidth: "120px",
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            {row.employment_type}
          </div>
        ),
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Interview Date</div>
      ),
      id: "updatedAt",
      selector: (row) => row.roundDate || "",
      sortable: true,
      minWidth: "150px",
      center: true,
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
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Result</div>,
      selector: (row) => row.interviewResult,
      sortable: true,
      minWidth: "100px",
      center: true,

      cell: (row) => {
        if (loading) return <TableSkeleton />;
        const isPending = row.interviewResult === "Pending";
        const displayText =
          row.status === "Rejected" ? "Rejected" : row.interviewResult;
        return (
          <div style={{ textAlign: "center" }}>
            {isPending ? (
              <>
                <div className="highlight-pending">
                  {" "}
                  <img src={PendingIcon} alt="Pending" />
                  <span>{displayText}</span>
                </div>
              </>
            ) : (
              <div className="highlight-rejected">
                {" "}
                <img src={RejectedIcon} alt="Rejected" width={16} height={16} />
                <span> {displayText}</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Referred Date</div>
      ),
      selector: (row) => row.created_at,
      sortable: true,
      minWidth: "150px",
      center: true,

      cell: (row) => {
        if (loading) return <TableSkeleton />;
        const date = new Date(row.created_at);
        const formattedDate = `${String(date.getDate()).padStart(
          2,
          "0"
        )}-${date.toLocaleString("en-GB", {
          month: "short",
        })}-${date.getFullYear()}`;
        return (
          <div style={{ textAlign: "center", width: "100%" }}>
            {formattedDate}
          </div>
        );
      },
    },
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Actions</div>,
      minWidth: "180px",
      center: true,

      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
            }}
          >
            <button
              title="View"
              onClick={() => {
                viewReferral(row);
                // setViewEmailed(true);
                setIsReferral(row); // This sets the selected referral
                setViewEmailed(true); // This triggers the view component
                console.log("View", row);
                setcurrentTab(false);
                sendDataToParent(false);
              }}
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
              title="Ratings"
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

  const viewReferral = (row) => {
    console.log("coming from emailed");
    console.log("currentTab", currentTab);
    setcurrentTab(false);
    setIsReferral(row);
  };

  useEffect(() => {
    console.log(isReferral, "isReferral");
  }, [isReferral]);

  const scheduleMail = () => {
    setSchedule(true);
  };

  const driveComplete = () => {
    setIsDrive(true);
  };

  const closeModal = () => {
    setIsDrive(false);
    setSchedule(false);
    setRate(false);
    setEdit(false);
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
    const drive_data = {
      reason: isReason,
      drive_start: isStartDate,
      drive_end: isEndDate,
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
        console.log(updateReferralStatusResponse);
        if (updateReferralStatusResponse.ok) {
          console.log("Referral stages updated successfully.");
        } else {
          console.log("Error updating referral stages.");
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
    setIsDrive(false);
  };

  const handleReasonChange = (event) => {
    setReason(event.target.value);
  };

  const handleDateChange = (e) => {
    if (e.target.id === "start-date") {
      setStartDate(e.target.value);
    } else if (e.target.id === "end-date") {
      setEndDate(e.target.value);
    }
  };

  const backToCurrent = () => {
    setcurrentTab(true);
    sendDataToParent(true);
  };

  const editReferral = (row) => {
    setEdit(true);
    setIsReferral(row);
    // console.log("Edit Referral at", row._id);
    // console.log(row.interviewResult)
  };

  const rateReferral = (row) => {
    setRate(true);
    setIsReferral(row);
    // console.log("Rate Referral");
  };

  return (
    <>
      {currentTab ? (
        <div className="right-content-usermanagement">
          <div className="user-management-section-one"></div>
          <div>
            <div className="btn-set">
              {isDrive && (
                <div className="modal-overlay">
                  {/* ...Drive Completion Modal... */}
                </div>
              )}

              {isSchedule && (
                <div className="modal-overlay">
                  {/* ...Schedule Modal... */}
                </div>
              )}

              {isRate && (
                <RateReferral
                  referral={isReferral}
                  closeModal={closeModal}
                  fetchCurrent={fetchCurrent}
                  fetchCurrentTable={fetchCurrentTable}
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

            {selectedReferralTab === "all" && (
              <>
                <div
                  className={`custom-table-wrapper theme-change-${
                    isTheme ? "dark" : "theme"
                  }`}
                  style={{
                    "--pagination-icon-color": isTheme ? "white" : "black",
                    "--pagination-icon-disabled-color": isTheme
                      ? "#adb5bd"
                      : "#ccc",
                    "--pagination-bg": isTheme ? "#495057" : "#fff",
                    "--pagination-text-color": isTheme ? "white" : "black",
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
                        // striped
                        sortIcon={<FaSort />}
                        defaultSortFieldId="updatedAt"
                        defaultSortAsc={false}
                        responsive
                        selectableRows
                        onSelectedRowsChange={
                          (state) =>
                            console.log("Selected Rows:", state.selectedRows) // 🔹 Callback when selected rows change (returns selected rows)
                        }
                      />
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div>
          <ViewReferral
            referral={isReferral}
            goBackToAllReferrals={goBackToAllReferrals}
            backToCurrent={backToCurrent}
          />
        </div>
      )}
    </>
  );
};

export default Technical;
