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
import GroupDiscussions from "../GroupDiscussions/GroupDiscussions";
import Technical from "../Technical/Technical";
import Rejected from "../Rejected/Rejected";
import Selected from "../Selected/Selected";
import FinalHR from "../FinalHR/FinalHR";
import { ThemeContext } from "../ThemeContext/ThemeContext";

const Emailed = ({
  goBackToAllReferrals,
  value,
  someProp,
  sendDataToParent,
  referral,
  statusValue,
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
  const [gdCombinedData, setGdCombinedData] = useState([]);
  const {isTheme} = useContext(ThemeContext)

  // console.log("onSendData ",tabBoolean);
  // switch (selectedReferralTab) {
  //   case "emailed":
  //     <Emailed/>
  //   break;
  // }
  // alert("emailed Tab", currentTab)
  console.log("all referral", referral);
  useEffect(() => {
    fetchCurrent();
  }, []);

  // useEffect(() => {
  //   getPeopleScheduledForGD();
  // }, []);

  const fetchCurrent = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/currentReferrals",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();

      const responseAboutInterview = await fetch(
        "http://localhost:3000/api/v1/referral/getAllSchedulesMailList"
      );
      const dataSchedule = await responseAboutInterview.json();

      const flattenedReferrals = [];

      dataSchedule.forEach((entry) => {
        const referralIds = entry.Total_Referral_id.split(",");
        referralIds.forEach((referralId) => {
          flattenedReferrals.push({
            referralId: referralId.trim(),
            gdDate: entry.roundDate,
            createdAt: entry.createdAt,
            mailSent: entry.mailSent,
            round: entry.round,
          });
        });
      });

      // Create a lookup map for fast access
      const flattenedMap = Object.fromEntries(
        flattenedReferrals.map((item) => [item.referralId, item])
      );

      // console.log("statusValue", statusValue)
      // alert(statusValue);
      const referralListByStatus = data.filter(
        (ref) => ref.status === statusValue
      );

      const combinedData = referralListByStatus.map((referral) => {
        const matchedData = flattenedMap[referral._id];

        return {
           ...referral,
          id: referral._id,
          name: `${referral.referral_fname} ${referral.referral_lname}`,
          role: referral.role_applied,
          resume: referral.resume,
          status: referral.status,
          referral_email: referral.referral_email,
          // gdRound: matchedData?.round || "Not Scheduled",
          gdDate: matchedData?.gdDate || "Pending",
          mailSentDate: matchedData?.createdAt || "N/A",
        };
      });

      console.log("Combined Data", combinedData);
      const usersWithAvatars = await Promise.all(
        combinedData.map(async (user) => {
          const [firstName, lastName] = user.name.split(" ");
          const initials = (firstName?.[0] || "") + (lastName?.[0] || ""); // safeguard undefined

          try {
            const fetchAvatars = await fetch(
              `https://api.dicebear.com/9.x/initials/svg?seed=${initials}`
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
      setGdCombinedData(combinedData); // optionally store this combined GD data
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  // const getPeopleScheduledForGD = async () => {
  //   const responseAboutInterview = await fetch(
  //     "http://localhost:3000/api/v1/referral/getAllSchedulesMailList"
  //   );
  //   const dataSchedule = await responseAboutInterview.json();
  //   console.log("form schedule one", dataSchedule);

  //   // const getAllReferralIdS = dataSchedule.Total_Referral_id;
  //   const getAllReferralIdS = dataSchedule.map(
  //     (dataSchedule) => dataSchedule.Total_Referral_id
  //   );
  //   console.log("only mail sent ids", getAllReferralIdS);
  // };

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
      name: <input type="checkbox" onChange={handleSelectAll} />,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.id)}
            onChange={() => handleRowSelect(row.id)}
          />
        ),
      width: "45px",
    },

    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Name </div>,
      selector: (row) => row.referral_fname + " " + row.referral_lname,
      sortable: true,

      grow: 1, // Expands to take remaining space
      // wrap: true,
      minwidth: "120px",
      maxwidth: "350px",
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "flex-start", // Align top if content wraps
              gap: "8px",
              width: "100%",
              flexWrap: "nowrap", // prevents avatar + text from splitting lines
              padding: "0.9em",
            }}
          >
            <img
              src={row.avatarUrl}
              alt="Avatar"
              width="30"
              height="30"
              style={{ borderRadius: "50%", flexShrink: 0 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minWidth: 0, // ensures text wraps correctly inside flex
                wordBreak: "break-word",
                whiteSpace: "normal",
              }}
            >
              <span
                className="referralName"
                style={{
                  fontWeight: "bold",
                  overflowWrap: "break-word",
                  fontSize: "1.1em",
                  fontWeight: "500",
                  color: isTheme ? "white" : "#283e46",
                }}
              >
                {row.name}
              </span>
              <a
                href={`mailto:${row.referral_email}`}
                style={{
                   color: isTheme ? "rgb(144, 224, 239)" : "#653FFD",
                  textDecoration: "none",
                  overflowWrap: "break-word",
                  minWidth: "120px",
                  maxWidth: "350px",
                }}
                title={row.referral_email} // optional: show full email on hover
                className="ellipsis-text"
              >
                {row.referral_email}
              </a>
            </div>
          </div>
        ),
    },
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Status</div>,
      selector: (row) => row.status || "N/A",
      sortable: true,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        }
        return (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ReferralStatus selectedStatus={row.status} />
          </div>
        );
      },
    },

   
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Resume</div>,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        } else {
          if (row.resume_file && row.resume_file.data) {
            const byteArray = new Uint8Array(row.resume_file.data.data);
            const blob = new Blob([byteArray], {
              type: row.resume_file.mimetype,
            });
            const url = URL.createObjectURL(blob);

            return (
              <div style={{ textAlign: "center", width: "100%" }}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#653FFD",
                    textDecoration: "none",
                    display: "inline-block",
                    textAlign: "center",
                    wordBreak: "break-word",
                  }}
                >
                  {row.resume_file.filename}
                </a>
              </div>
            );
          }
        }

        return <div style={{ textAlign: "center", width: "100%" }}>N/A</div>;
      },
      sortable: true,
      center: true, // ensures column alignment at table level (optional)
    },

    // {
    //   name: (
    //     <div style={{ textAlign: "center", width: "100%" }}>Referred By</div>
    //   ),
    //   selector: (row) => row.referredBy || "N/A", // ensure correct fallback
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

    // {
    //   name: (
    //     <div
    //       style={{
    //         whiteSpace: "normal",
    //         wordBreak: "break-word",
    //         textAlign: "center",
    //         width: "100%",
    //       }}
    //     >
    //       Employee Type
    //     </div>
    //   ),
    //   selector: (row) => row.employment_type,
    //   cell: (row) =>
    //     loading ? (
    //       <TableSkeleton />
    //     ) : (
    //       <div style={{ textAlign: "center", width: "100%" }}>
    //         {row.employment_type}
    //       </div>
    //     ),
    //   sortable: true,
    // },

    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            textAlign: "center",
            width: "100%",
          }}
        >
          Interview Date
        </div>
      ),
      // selector: (row) => row.created_at,
      selector: (row) => row.gdDate,
      sortable: true,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        } else {
          const date = new Date(row.gdDate);
          const day = String(date.getDate()).padStart(2, "0");
          const month = date.toLocaleString("en-GB", { month: "short" });
          const year = date.getFullYear();

          const formattedDate = `${day}-${month}-${year}`;

          return (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", // vertically centers the content
                width: "100%",
                backgroundColor: "#E6F4EA",
                padding: "0.5em 0.6em",
                borderRadius: "25px",
                color: "#2E7D32",
                fontWeight: "500",
                maxWidth: "125px",
                margin: "0 auto", // horizontally centers the block itself if needed
              }}
            >
              {formattedDate}
            </div>
          );
        }
      },
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            textAlign: "center",
            width: "100%",
          }}
        >
          Email Sent Date{" "}
        </div>
      ),
      // selector: (row) => row.created_at,
      selector: (row) => row.mailSentDate,
      sortable: true,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        } else {
          const date = new Date(row.mailSentDate);
          const day = String(date.getDate()).padStart(2, "0");
          const month = date.toLocaleString("en-GB", { month: "short" });
          const year = date.getFullYear();

          const formattedDate = `${day}-${month}-${year}`;

          return (
            <div style={{ textAlign: "center", width: "100%" }}>
              {formattedDate}
            </div>
          );
        }
      },
    },
    {
      name: (
        <div
          style={{
            whiteSpace: "normal",
            wordBreak: "break-word",
            textAlign: "center",
            width: "100%",
          }}
        >
          Actions{" "}
        </div>
      ),
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              textAlign: "center",
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <button
              title="View"
              onClick={() => {
                // setViewEmailed(true);
                setIsReferral(row); // This sets the selected referral
                setViewEmailed(true); // This triggers the view component
                console.log("View", row);
                setcurrentTab(false);
                sendDataToParent(false);
                // someProp(false);
                // onSendData(dataToSend);
                // setSelectedReferral(row);
                // setShowView(true);
                console.log("View", row);
              }}
              className="action-buttons"
            >
              <img
                src="./src/assets/images/view.svg"
                alt="viewReferral"
                width={20}
              />

              {/* <span className="view icons"></span> */}
            </button>
            <button
              title="Edit"
              onClick={() => {
                editReferral(row);
                console.log("Edit", row);
              }}
              className="action-buttons"
            >
              {/* <span className="edit icons"></span> */}
              <img
                src="./src/assets/images/edit.svg"
                alt="viewReferral"
                width={20}
              />
            </button>
            <button
              title="Ratings"
              onClick={() => {
                rateReferral(row);
                console.log("Ratings", row);
              }}
              className="action-buttons"
            >
              <img src="./src/assets/images/rating.svg" width={20} alt="" />
              {/* <span className="rate icons_disable"></span> */}
            </button>
          </div>
        ),
      // allowOverflow: true,
      // button: true,
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
    headCells: {
      style: {
        whiteSpace: "normal",
        wordBreak: "break-word",
        // textAlign: "center", // optional
        fontSize: "1em",
        // minHeight: '56px',
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
    rows: {
      style: {
        minHeight: "48px",
        fontSize: "0.8em",
        color: isTheme ? "white" : "#333",
        // backgroundColor: isTheme ? "#343a40" : "#fff",
        borderBottom: "1px solid #ddd",
        "&:nth-of-type(odd)": {
          backgroundColor: isTheme ? "#343a40" : "#fff",
        },
        "&:nth-of-type(even)": {
          backgroundColor: isTheme ? "#495057" : "#fff",
        },
      },
    },
    pagination: {
      style: {
        backgroundColor: isTheme ? "#495057" : "#fff",
      },
    },
    cells: {
      style: {
        paddingLeft: "10px",
        paddingRight: "10px",
        color: isTheme ? "white" : "#283e46",
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
    console.log("Edit Referral at", row._id);
  };

  const rateReferral = (row) => {
    setRate(true);
    setIsReferral(row);
    console.log("Rate Referral");
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
                <RateReferral referral={isReferral} closeModal={closeModal} />
              )}
              {isEdit && (
                <EditReferral referral={isReferral} closeModal={closeModal} />
              )}
            </div>

            {selectedReferralTab === "all" && (
              <>
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
                      defaultSortFieldId={0}
                      defaultSortAsc={true}
                    />
                  </div>
                )}
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

export default Emailed;
