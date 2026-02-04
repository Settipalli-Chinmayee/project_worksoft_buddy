import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./AllReferrals.css";
import "./TableComponent.css";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";
import DataTable from "react-data-table-component";
import ViewIndividualReferrals from "../ViewIndividualReferrals/ViewIndividualReferrals";
import EditIndividualReferrals from "../EditIndividualReferrals/EditIndividualReferrals";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css"; //this is important to render
import TableSkeleton from "./TableSkeleton";
import { FaUpload, FaSort, FaStreetView, FaFileDownload } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import AddNewReferral from "../AddNewReferral/AddNewReferral";
import ReferralStatus from "../ReferralStatus/ReferralStatus";
import { useAuth } from "../UserContext/UserContext";
import Current from "../Current/Current";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import PdfThemeLightIcon from "../../assets/images/pdfLightThemeIcon.svg";
import PdfThemeDarkIcon from "../../assets/images/pdfDarkThemeIcon.svg";

// import { view } from "../../assets/images/view.svg";
// import { edit } from "../../assets/images/edit.svg";
// import { treeView } from  "../../assets/images/treeView.svg"
// import { tableView } from "../../assets/images/tableView.svg"
// import  {SkeletonTheme} from 'react-loading-skeleton'

const AllReferrals = () => {
  document.title = "HR Referral Portal | Referrals";
  let location = useLocation();
  // const shouldOpenModal = location.state?.openReferralModal;

  // localStorage.setItem("username", userName);
  // let referredUserName = localStorage.getItem("userName");
  // console.log("from localstorage", referredUserName);

  const { authState } = useAuth();
  // console.log("Auth state:", authState);
  const referredUserName = authState?.user?.userName;
  const userRoleAccess = authState?.user?.userRole;
  const userIdAccess = authState?.user?.userId;
  const userStatus = authState?.user?.status;
  // console.log(userStatus, "user status");
  //   if (!referredUserName) {
  //   return <Navigate to="/referrallogin" />;
  // }
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedReferal, setSelectedReferral] = useState(null);
  const [showView, setShowView] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [profileIntials, setProfileIntials] = useState("");
  const [selectTab, setselectTab] = useState("All");
  // const [isTheme, setTheme] = useState(() => {return sessionStorage.getItem("referralTheme") || "light"});
  const { isTheme } = useContext(ThemeContext);
  const navigate = useNavigate()

  //  useEffect(() => {
  //   const savedTheme = sessionStorage.getItem("referralTheme") || "light";
  //   setTheme(savedTheme);
  // }, []);
  const shouldOpenModal =
    isFormOpen || location.state?.openReferralModal === true;
      const referredJob = location.state?.referredJob || null;
  // console.log(referredJob)
  // console.log(shouldOpenModal);
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
  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/referral/allReferrals",
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await res.json();
      // alert(userRoleAccess );
      // alert(referredUserName );
      // console.log("Data fetched:", data); // Check the structure here
      // const filteredData = userRoleAccess === 'admin' ? referred_by : ;

      // Assuming `referred_by` is the field indicating who referred the user
      const filteredData =
        userRoleAccess !== "Employee"
          ? data // Admin sees all referrals
          : data.filter((user) => user.referred_by === referredUserName); // Regular user sees only their own referrals

      // console.log("filter data", filteredData);
      const usersWithAvatars = await Promise.all(
        filteredData.map(async (user) => {
          const initials =
            user.referral_fname[0] + " " + user.referral_lname[0];
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
            return user; // Fallback to the user without avatar if error occurs
          }
        })
      );

      setUserData(usersWithAvatars);
      setFilteredData(usersWithAvatars);
      // console.log("data", filteredData);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authState?.user?.userName && authState?.user?.userRole) {
      fetchUsers();
    }
  }, [authState?.user?.userName, authState?.user?.userRole]);
  // State to track selected rows

  // Toggle single row
  const handleRowSelect = (id) => {
    setSelectedRows((prevSelected) => {
      const isSelected = prevSelected.includes(id);
      const updatedSelection = isSelected
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id];

      if (!isSelected) {
        //  Fetch or process the selected row ID here
        // console.log("Selected Row ID:", id);
        // Example: Call an API or function
        // fetchReferralDetailsById(id);
      }

      return updatedSelection;
    });
  };

  // Toggle all
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const allRowIds = filteredData.map((row) => row.id);
    setSelectedRows(isChecked ? allRowIds : []);
  };

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(userData);
    } else {
      const filtered = userData.filter(
        (user) =>
          user.referral_fame
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.referral_email
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.role_applied?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchQuery, userData]);

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

  const handleTabClick = (role) => {
    setActiveTab(role);
    if (role === "All") {
      setFilteredData(userData);
    } else {
      const filtered = userData.filter(
        (user) => user.department?.toLowerCase() === role.toLowerCase()
      );
      setFilteredData(filtered);
    }
  };

  // const statusColors = {
  //   "Under Review": "#17a2b8",
  //   Submitted: "#343a40",
  //   Interviewing: "#800000",
  //   "Offer Extended": "#007bff",
  //   Hired: "#28a745",
  //   // Hired: "#dc3545",
  //   Rejected: "#dc3545",
  //   Archived: "green",
  //   Pending: "#ffc107", // Added yellow for better visibility
  // };

  // console.log("DATA", data);

  const columns = [
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Name </div>,
      selector: (row) => row.referral_fname + " " + row.referral_lname,
      sortable: true,
      grow: 0,
      minWidth: "200px",
      maxWidth: "500px",
      center: true,
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
            <img src={row.avatarUrl} alt="Avatar" width="30" height="30" />
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
                {row.referral_fname + " " + row.referral_lname}
              </span>
              <a
                href={`mailto:${row.referral_email}`}
                className="ellipsis-text"
                style={{
                  color: isTheme ? "rgb(144, 224, 239)" : "#653FFD",
                  textDecoration: "none",
                  overflowWrap: "break-word",
                  minWidth: "110px",
                  // minWidth: "120px",
                  maxWidth: "350px",
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
      selector: (row) => row.status || "N/A",
      sortable: true,
      grow: 1,
      minWidth: "180px",
      maxWidth: "200px",
      center: true,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        }
        return (
          <div
            style={{
              // textAlign: "left",
              width: "100%",
              display: "flex",
              // paddingLeft: "0.3em"

              justifyContent: "center",
            }}
          >
            <ReferralStatus selectedStatus={row.status} />
          </div>
        );
      },
    },

    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Department</div>
      ),
      selector: (row) => row.department,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        } else {
          return (
            <div style={{ textAlign: "center", width: "100%" }}>
              {row.department}
            </div>
          );
        }
      },

      sortable: true,
      wrap: true,
    },
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Resume</div>,
      sortable: true,
      center: true,
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
              style={{
                color: "#653FFD",
                textDecoration: "none",
                wordBreak: "break-word",
              }}
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
        return <div style={{ textAlign: "center", width: "100%" }}>N/A</div>;
      },
    },

    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Referred By</div>
      ),
      selector: (row) => row.referred_by,
      sortable: true,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div
            style={{
              textAlign: "center",
              width: "100%",
              textTransform: "capitalize",
            }}
          >
            {row.referred_by || "N/A"}
          </div>
        ),
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
          Employee Type
        </div>
      ),
      selector: (row) => row.employment_type,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            {row.employment_type}
          </div>
        ),
      sortable: true,
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
          Referred Date
        </div>
      ),
      id: "updatedAt",
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => {
        if (loading) {
          return <TableSkeleton />;
        } else {
          const date = new Date(row.created_at);
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
        ) : userRoleAccess === "Employee" ? (
          <div className="actions-section">
            <div
              className="action-buttons"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                title="View"
                onClick={() => {
                  setSelectedReferral(row);
                  setShowView(true);

                  // console.log("View", row);
                }}
              >
                <img src="./src/assets/images/view.svg" alt="viewReferral" />
                {/* <span className="view icons"></span> */}
              </span>
            </div>
            <div className="action-buttons">
              <span
                title="Edit"
                onClick={() => {
                  setSelectedReferral(row);
                  setShowEdit(true);
                  // console.log("Edit", row);
                }}
              >
                <img src="./src/assets/images/edit.svg" alt="viewReferral" />
              </span>
            </div>

            {/* <button
              title="Disable"
              onClick={() => {
                setSelectedReferral(row);
                setShowEdit(true);
                console.log("Disbale", row);
              }}
            >
              <span className="disable icons_disable"></span>
            </button> */}
          </div>
        ) : (
          <div className="actions-section">
            <div
              className="action-buttons"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <span
                title="View"
                onClick={() => {
                  setSelectedReferral(row);
                  setShowView(true);

                  // console.log("View", row);
                }}
              >
                <img src="./src/assets/images/view.svg" alt="viewReferral" />
                {/* <span className="view icons"></span> */}
              </span>
            </div>
            <div className="action-buttons">
              <span
                title="Edit"
                onClick={() => {
                  setSelectedReferral(row);
                  setShowEdit(true);
                  // console.log("Edit", row);
                }}
              >
                <img src="./src/assets/images/edit.svg" alt="viewReferral" />

                {/* <span className="edit icons"></span> */}
              </span>
            </div>

            {/* <button
              title="Disable"
              onClick={() => {
                setSelectedReferral(row);
                setShowEdit(true);
                console.log("Disbale", row);
              }}
            >
              <span className="disable icons_disable"></span>
            </button> */}
          </div>
        ),
      // allowOverflow: true,
      // button: true,
    },
  ];

  return (
    <>
      <div className="main-container">
        <ReferralSidebar />
        {showView && selectedReferal && (
          <ViewIndividualReferrals
            referralData={selectedReferal}
            onClose={() => setShowView(false)}
          />
        )}

        {showEdit && selectedReferal && (
          <EditIndividualReferrals
            referralId={selectedReferal._id}
            referralEditData={selectedReferal}
            onClose={() => {
              // console.log("here!");
              setShowEdit(false);
            }}
            onUpdateSuccess={fetchUsers}
          />
        )}
        <div className="main-content">
          <div className="table-container">
            <div className="right-content-usermanagement">
              <div className="user-management-section">
                {/* NEWFORM */}
                {/* {isFormOpen && (
                  <AddNewReferral
                    referredUserName={referredUserName}
                    onClose={() => {
                      setFormOpen(false);
                    }}
                    onReferralAdded={(newReferral) => {
                      setUserData((prev) => [...prev, newReferral]);
                      setFilteredData((prev) => [...prev, newReferral]);
                      fetchUsers();
                    }}
                  />
                )} */}
                {shouldOpenModal && (
                  <AddNewReferral
                    referredUserName={referredUserName}
                      referredJob={referredJob}

                    onClose={() => {
                      setFormOpen(false);
                      // Clean the navigation state
                      if (location.state?.openReferralModal) {
                        navigate(location.pathname, { replace: true });
                      }
                    }}
                    onReferralAdded={(newReferral) => {
                      setUserData((prev) => [...prev, newReferral]);
                      setFilteredData((prev) => [...prev, newReferral]);
                      fetchUsers();
                      // Optional: close modal after add
                      setFormOpen(false);
                      if (location.state?.openReferralModal) {
                        navigate(location.pathname, { replace: true });
                      }
                    }}
                  />
                )}

                <div className="user-management">
                  {selectTab === "All" && (
                    <div className="user-management-section-one">
                      <div className="pageHeadings">
                        <span
                          className={`referralIcon icon referralIcon-${
                            isTheme ? "dark" : "light"
                          }`}
                        ></span>
                        <h4
                          // onClick={goBackToAllReferrals}
                          style={{
                            cursor: "pointer",
                            color: isTheme ? "white" : "#283e46",
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
                          All
                        </span>
                      </div>
                      {/* <div className="pageHeadings">
                        <span className="referralIcon icon"></span>
                        <h4>Referrals</h4>
                      </div> */}
                      {/* {selectTab === "All" ? ( */}
                      <div>
                        <button
                          onClick={() => setFormOpen(true)}
                          className="invite-user-btn"
                        >
                          <span className="invite_user_icon"></span>
                          Referral
                        </button>
                      </div>
                      {/* ) : (
                      ""
                    )} */}
                    </div>
                  )}

                  {/* tabs section */}
                  {/* {selectTab === "All" && (
                    <div className="tabReferrals">
                      <div className="tabs-container-users">
                        <div className="leftSideButtons">
                          <button
                            onClick={() => {
                              setselectTab("All");
                            }}
                            className={`${
                              selectTab === "All" ? "active-tab" : ""
                            }`}
                          >
                            <span
                              className={`${
                                selectTab === "All" ? "tabIcon iconTab" : " "
                              } `}
                            ></span>
                            All
                          </button> */}
                  {/* {selectTab === "Current" && (
                            <img
                              src="./src/assets/images/breadcrumbs-svgrepo-com.svg"
                              width={18}
                              className="allReferralsTab-bread-crumbs"
                            />
                          )}
                          <button
                            className={`${
                              selectTab === "Current" ? "active-tab" : " "
                            }`}
                            onClick={() => {
                              setselectTab("Current");
                            }}
                          >
                            <span
                              className={`${
                                selectTab === "Current"
                                  ? "tabIcon iconTab"
                                  : " "
                              } `}
                            ></span>
                            Current
                          </button>
                        </div> */}
                  {/* <div className="rightSideButtons"></div> */}

                  {/* <h1 onClick={changeTab}>Current</h1>
                    {currentTab && <Current />}
                      <Link to="/current">
                        <h1>Current</h1>
                      </Link> */}
                  {/* </div>
                    </div> */}
                  {/* )} */}

                  {selectTab == "All" ? (
                    <div className="allReferralSection">
                      <div className="tabsAndView">
                        <div
                          className={`tabs-container tabs-${
                            isTheme ? "dark" : "light"
                          }`}
                        >
                          {/* {["All", "WorkSoft", "IA/RPA", "Web Development"].map( */}
                          {["All", "WorkSoft", "IA/RPA", "Web Development"].map(
                            (role) => (
                              <button
                                key={role}
                                value={role}
                                onClick={() => handleTabClick(role)}
                                className={
                                  activeTab === role ? "active-tab" : ""
                                }
                                style={{
                                  // color: isTheme && activeTab === role ? "#65849b" : "#124265",
                                  backgroundColor: isTheme ? "black" : "white",
                                }}
                              >
                                <span
                                  className={
                                    activeTab === role
                                      ? `active-tab tabIcon-${
                                          isTheme ? "dark" : "light"
                                        } iconTab`
                                      : ""
                                  }
                                ></span>
                                {role}
                              </button>
                            )
                          )}
                        </div>
                        <div className="search-container">
                          <input
                            type="text"
                            className="searchField"
                            placeholder="Search by name, email, or role"
                            value={searchQuery}
                            style={{ color: isTheme ? "white" : "black" }}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>

                        {/* <div className="ViewModeConatiner">
                      <div className="view-toggle">
                        <input
                          type="radio"
                          name="viewMode"
                          id="table_views"
                          value="Table View"
                          checked
                        />
                        <label
                          htmlFor="table_views"
                          title="Table View"
                          className="toggle-button"
                        >
                          <span title="Table View" className="tableViewIcon" />
                        </label>

                        <input
                          type="radio"
                          name="viewMode"
                          id="tree_views"
                          value="Tree View"
                        />
                        <label htmlFor="tree_views" className="toggle-button">
                          <span title="Table View" className="treeViewIcon" />
                        </label>
                      </div>
                    </div> */}
                      </div>
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
                            highlightOnHover
                            pagination
                            selectableRows={false}
                            // progressPending={loading}
                            // paginationPerPage={1}  // Controls how many rows per page

                            // progressComponent={<TableSkeleton />}
                          />
                        ) : (
                          <div className="custom-table-wrapper">
                            <DataTable
                              customStyles={customStyles}
                              columns={columns}
                              data={filteredData}
                              pagination
                              // highlightOnHover
                              // striped
                              sortIcon={<FaSort />} // Use custom icon (optional)
                              // defaultSortFieldId={0}
                              defaultSortFieldId="updatedAt"
                              defaultSortAsc={false}
                              // defaultSortAsc={true}
                              noDataComponent={
                                <div
                                  style={{
                                    padding: "20px",
                                    textAlign: "center",
                                  }}
                                >
                                  No data available
                                </div>
                              }
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Current
                      value="current"
                      goBackToAllReferrals={() => setselectTab("All")}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllReferrals;
