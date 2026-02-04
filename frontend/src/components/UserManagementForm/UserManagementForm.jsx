import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import DataTable from "react-data-table-component";
import "./UserManagementForm.css";
import AllReferrals from "../AllReferrals/AllReferrals";
import IndividualUserReferrals from "../IndividualUserReferrals/IndividualUserReferrals";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import ellipsisIcon from "../../assets/images/ellipsisIcon.svg";
import ellipsisIcon_dark from "../../assets/images/ellipsisIcon-dark.svg";
import { useAuth } from "../UserContext/UserContext";
import { toast } from "react-toastify";
import CloseBtn from "../../commonFolder/CloseBtn/CloseBtn";
import { FaSort } from "react-icons/fa";
import TableSkeleton from "../AllReferrals/TableSkeleton";

const UserManagementForm = () => {
      document.title = "HR Referral Portal | User Management"

  const [activeTab, setActiveTab] = useState("All");
  const [activeDeptTab, setActiveDeptTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [passData, setPassData] = useState({});
  const [closeTheStatus, setCloseTheStatus] = useState(false);
  const [activeStatusRow, setActiveStatusRow] = useState(null); // index or user id
  const [activeRow, setActiveRow] = useState(null);
  const [activeDept, setActiveDept] = useState(null);
  const [isCloseTheDept, setCloseTheDept] = useState(null);
  // const [activeStatusRow, setActiveStatusRow] = useState(true); // index or user id
  const [isOptions, setOptions] = useState(false);
  const [isDept, setDept] = useState("");
  const [isAllDept, setAllDept] = useState([]);
  const [isRole, setRole] = useState("");
  const [closeTheRole, setcloseTheRole] = useState(false);
  const { authState } = useAuth();
  const userId = authState?.user?.userId;
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  // useEffect(() => {
  //   console.log(userStatus, "user status for authentication");

  //   if (userStatus == "Inactive") {
  //     navigate("/login");
  //   } else if (userStatus == "Active"){
  //     console.log("active user")
  //   }
  // }, [userStatus, navigate]);

  const { isTheme } = useContext(ThemeContext);
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

  const handleStatusEdit = (userId) => {
    // alert(userId);
    console.log("status", userId);
    setCloseTheStatus(true);
    // setActiveStatusRow((prevId) => (prevId === userId ? null : userId));
    setActiveStatusRow(userId);
  };

  // const closePopup = () => {
  //   alert(activeStatusRow)
  //   activeStatusRow(true);
  // }

  const allDepartments = [
    "Worksoft",
    "IA/RPA",
    "Worksoft QA",
    "Worksoft Support",
    "IT & Administration",
    "Web Development",
  ];

  // Fetch and enrich data with user and referral details (including avatars)
  useEffect(() => {
    userManagementInfo();
  }, [userId]);

  const userManagementInfo = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/v1/referral/referralSignup",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (res.status == 403) {
        const errorData = await res.json();
        console.error("Server response:", errorData);
        navigate("/*");
        throw new Error("Failed to fetch all signup users");
      }

      const result = await res.json();
      // console.log(result.logout)
      if (result.logout) {
        navigate("/referralLogin");
      }
      const users = result.users || [];
      const referrals = result.allReferrals || [];
      const currentUser = users.find((user) => user._id === userId);
      if (currentUser?.status === "Inactive") {
        // const getStatus = localStorage.getItem("userDetails");
        // if (getStatus) {
        //   const userDetails = JSON.parse(getStatus);
        //   userDetails.status = "Inactive";
        //   localStorage.setItem("userDetails", JSON.stringify(userDetails));
        //   console.log(userDetails, "updated user details!");
        // }
        navigate("/referralLogin");
        return;
      }

      // console.log("All users:", users);
      // console.log("All referrals:", referrals);

      const userReferralsMap = {};

      // Create the mapping of user referrals
      users.forEach((user) => {
        const userName = user.userName;
        userReferralsMap[userName] = referrals.filter(
          (referral) => referral.referred_by === userName
        );
      });

      // console.log("User-specific referrals:", userReferralsMap);

      setPassData(userReferralsMap);

      // Enrich users with avatars
      const enrichedUsers = await Promise.all(
        users.map(async (user) => {
          const avatarUrl = await getAvatarUrl(user.userName);

          // Enrich each referral with avatar URL
          const enrichedReferrals = await Promise.all(
            userReferralsMap[user.userName].map(async (referral) => {
              const referralAvatarUrl = await getAvatarUrl(
                referral.referral_fname,
                referral.referral_lname
              );
              return {
                ...referral,
                avatarUrl: referralAvatarUrl,
              };
            })
          );

          return {
            ...user,
            avatarUrl,
            referrals: enrichedReferrals,
          };
        })
      );

      const deptCounts = countUserDepartments(enrichedUsers);

      setUserData(enrichedUsers);
      setFilteredData(enrichedUsers);
      setDepartmentCounts(deptCounts);
    } catch (err) {
      console.error("Error in fetching details:", err);
    }
  };

  const updateUserStatus = async (userId, CurrentStatus) => {
    // console.log(CurrentStatus,"current status")
    let newStatus;
    if (CurrentStatus == "Active") {
      newStatus = "Inactive";
    } else if (CurrentStatus == "Inactive") {
      newStatus = "Active";
    }
    // console.log(newStatus,"new updated status")
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/referral/updateStatus/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) {
        toast.error("Status update failed");
        throw new Error("Failed to update status");
      }
      toast.success(`Status Updated sucessfully`);
      await userManagementInfo(); // Refresh data
      setActiveStatusRow(null); // Hide the status box
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  // Function to fetch avatar URL based on first and last name
  const getAvatarUrl = async (firstName, lastName) => {
    // console.log("fullmane", fullName)
    try {
      let fullName;

      if (lastName === undefined || lastName.trim() === "") {
        fullName = firstName;
        // console.log(fullName);
      } else {
        fullName = `${firstName} ${lastName}`;
      }
      const backgroundColorParam = darkAvatarColors.join(",");

      const response = await fetch(
        `https://api.dicebear.com/9.x/initials/svg?seed=${fullName}&backgroundColor=${backgroundColorParam}&textColor=ffffff&radius=50&fontSize=44&fontWeight=700`
      );
      const svgText = await response.text();
      return `data:image/svg+xml;utf8,${encodeURIComponent(svgText)}`;
    } catch (error) {
      console.error("Failed to fetch avatar for:", error);
      return "";
    }
  };

  const countUserDepartments = (users) => {
    const counts = {};
    users.forEach((user) => {
      counts[user.department] = (counts[user.department] || 0) + 1;
    });
    return counts;
  };

  const handleRoleEdit = (id) => {
    // console.log(id);
    setcloseTheRole(true);
    // setActiveRow((prevId) => (prevId === id ? null : id));
    setActiveRow(id);
  };
  const changeRole = async (e, row) => {
    e.preventDefault();
    let newRole = "";
    const rowId = row._id;
    console.log(isRole);
    if (isRole == "") {
      newRole = row.role;
    } else {
      newRole = isRole;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/referral/updateRole/${rowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) {
        toast.error("User Role update failed");
        throw new Error("Failed to update user role");
      }
      setcloseTheRole(false);
      setRole("");
      toast.success(`User Role Updated sucessfully`);
      await userManagementInfo(); // Refresh data
      setActiveRow(null); // Hide the status box
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleDeptEdit = (id) => {
    // console.log(id);
    setCloseTheDept(true);
    // setActiveDept((prevId) => (prevId === id ? null : id));
    setActiveDept(id);
    fetchDepartments();
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/department",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        // console.log(data);
        setAllDept(data);
        // setLoading(false);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const changeDept = async (e, row) => {
    e.preventDefault();
    let newDept = "";
    const rowId = row._id;
    if (isDept == "") {
      newDept = row.department;
    } else {
      newDept = isDept;
    }
    try {
      const res = await fetch(
        `http://localhost:3000/api/v1/referral/updateDept/${rowId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ department: newDept }),
        }
      );

      if (!res.ok) {
        toast.error("Department update failed");
        throw new Error("Failed to update status");
      }
      setCloseTheDept(false);
      setDept("");
      toast.success(`Department Updated sucessfully`);
      await userManagementInfo(); // Refresh data
      setActiveDept(null); // Hide the status box
    } catch (err) {
      console.error("Error updating user Department:", err);
    }
    // console.log("button");
  };

  // Filter data
  useEffect(() => {
    let tempData = [...userData];

    if (activeTab === "Inactive") {
      tempData = tempData.filter((item) => item.status === "Inactive");
    }

    if (activeDeptTab !== "All") {
      tempData = tempData.filter((item) => item.department === activeDeptTab);
    }

    if (searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      tempData = tempData.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.email.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredData(tempData);
  }, [activeTab, activeDeptTab, searchQuery, userData]);

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

  const columns = [
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Employee Id</div>
      ),

      sortable: true,
      grow: 0,
      minWidth: "200px",
      maxWidth: "300px",
      // center: true,

      selector: (row) => row.empId,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                width: "100%",
                padding: "0.6em 0.9em",
                textTransform: "uppercase",
              }}
              className="empText"
              onClick={() => setSelectedUser(row, row.empId)}
            >
              {row.avatarUrl && (
                <div>
                  <img
                    src={row.avatarUrl}
                    alt="Avatar"
                    width="30"
                    height="30"
                    // style={{ borderRadius: "50%", flexShrink: 0 }}
                  />
                </div>
              )}
              {row.empId}
            </div>
          </div>
        ),
    },
    {
      name: <div style={{ textAlign: "left", width: "100%" }}>Employee</div>,
      selector: (row) => row.userName,
      sortable: true,
      grow: 0,
      minWidth: "200px",
      maxWidth: "300px",
      center: true,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "left", width: "100%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                
              }}
              // onClick={() => setSelectedUser(row, row.userName)}
            >
              {/* {row.avatarUrl && (
              <img
                src={row.avatarUrl}
                alt="avatar"
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            )} */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontWeight: 500,
                    fontSize: "1.05em",
                    color: isTheme ? "white" : "#283e46",
                    cursor: "default",
                    textTransform: "capitalize",
                  }}
                >
                  {row.userName}
                </span>
                <a
                  href={`mailto:${row.email}`}
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
                >
                  {row.email}
                </a>{" "}
              </div>
            </div>
          </div>
        ),
    },
    // {
    //   name: (
    //     <div style={{ textAlign: "left", width: "100%" }}>Employee Email</div>
    //   ),
    //   selector: (row) => row.department,
    //   cell: (row) => (
    //     <div style={{ textAlign: "left", width: "100%" }}>
    //       <a
    //         href={`mailto:${row.email}`}
    //         style={{ color: "#653FFD", textDecoration: "none" }}
    //       >
    //         {row.email}
    //       </a>{" "}
    //     </div>
    //   ),
    // },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Department</div>
      ),
      selector: (row) => row.department,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            <p>{row.department}</p>
          </div>
        ),
    },

    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Employee Role</div>
      ),
      selector: (row) => row.role,
      sortable: true,

      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            <p>{row.role}</p>
          </div>
        ),
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Referred Count</div>
      ),
      selector: (row) => row.referrals.length,

      sortable: true,

      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            <p>{row.referrals.length}</p>
          </div>
        ),
    },
    // {
    //   name: (
    //     <div style={{ textAlign: "center", width: "100%" }}>View Referrals</div>
    //   ),
    //   cell: (row) => (
    //     <div style={{ textAlign: "center", width: "100%" }}>
    //       {Array.isArray(row.referrals) && row.referrals.length > 0 ? (
    //         <ul style={{ margin: 0, paddingLeft: 16 }}  className="referralNames">
    //           {row.referrals.map((ref, i) => (
    //             <li key={i}>
    //               <img
    //                 src={ref.avatarUrl}
    //                 alt="referral-avatar"
    //                 className="referralAvatarImage"
    //                 title={`${ref.referral_fname} ${ref.referral_lname}`}
    //                 // style={{
    //                 //   width: 20,
    //                 //   height: 20,
    //                 //   borderRadius: "50%",
    //                 //   objectFit: "cover",
    //                 //   marginRight: "10px",
    //                 // }
    //               />
    //               {/* {ref.referral_fname} {ref.referral_lname} */}
    //             </li>
    //           ))}
    //         </ul>
    //       ) : (
    //         <span>No referrals</span>
    //       )}
    //     </div>
    //   ),
    // },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>
          Employee Status
        </div>
      ),
      sortable: true,

      cell: (row) => (
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ display: "inline-flex" }}>
            {/* <a
              href="#"
              className={
                row.status === "Inactive" ? "status_Inactive" : "status_Active"
              }
            >
              {row.status}
            </a> */}
            <p
              className={
                row.status === "Inactive" ? "status_Inactive" : "status_Active"
              }
            >
              {row.status}
            </p>
          </div>
        </div>
      ),
    },
    {
      name: "Actions",
      center: true,
      minWidth: "150px",

      cell: (row) => (
        //         if(row.status == "Active"){
        //   setStatus("Deactivate")
        // } else if(row.status == "Inactive"){
        //   setStatus("Activate")
        // }
        <>
          <div>
            <div
              className="status-cell-wrapper"
              onClick={() => handleStatusEdit(row._id)}
            >
              <img
                // src={isTheme ? ellipsisIcon_dark : ellipsisIcon}
                src={
                  isTheme
                    ? "./src/assets/images/status-dark.svg"
                    : "./src/assets/images/status.svg"
                }
                alt="Options"
                className="ellipsis-icon"
                style={{
                  backgroundColor: isTheme
                    ? "#1714146e"
                    : "rgba(0, 0, 0, 0.05)",
                }}
                title="Change Status"
              />
            </div>

            {closeTheStatus && activeStatusRow === row._id && (
              <div className="modal-overlay">
                <div
                  className="modal-popup-action-status"
                  style={{
                    backgroundColor: isTheme ? "black" : "white",
                    border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                  }}
                >
                  <div className="popup-content">
                    <div className="heading-one">
                      <h1>User Status</h1>
                    </div>
                    <p>
                      Are you sure you want to Change status for{" "}
                      <span>{row.userName}</span>?
                    </p>
                    <span>
                      <strong>Note:</strong>{" "}
                      {/* This action will mark the user as inactive and disable their
                    access. */}
                      If the the action makes the user "Inactive", User access
                      will be Disabled.
                    </span>
                    <div className="cancel-inactive-div">
                      <button
                        onClick={() => setCloseTheStatus(false)}
                        className="cancel-btn"
                      >
                        <span className="cancel_btn cancel_icon_align "></span>
                        Close
                      </button>
                      <button
                        onClick={() => updateUserStatus(row._id, row.status)}
                        className="inactive_button"
                      >
                        <span className="submit_btn submit_icon_align"></span>
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ margin: "0px 10px" }}>
            <div
              className="status-cell-wrapper"
              onClick={() => handleRoleEdit(row._id)}
            >
              <img
                src={
                  isTheme
                    ? "./src/assets/images/role-dark.svg"
                    : "./src/assets/images/role.svg"
                }
                alt=""
                className="ellipsis-icon"
                style={{
                  backgroundColor: isTheme
                    ? "#1714146e"
                    : "rgba(0, 0, 0, 0.05)",
                }}
                title="Change Role"
              />
            </div>

            {closeTheRole && activeRow === row._id && (
              <div className="modal-overlay">
                <div
                  className="modal-popup-action-status"
                  style={{
                    backgroundColor: isTheme ? "black" : "white",
                    border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                  }}
                >
                  <div className="popup-content">
                    <div className="heading-one">
                      <h1>User Role</h1>
                    </div>
                    <form action="" onSubmit={(e) => changeRole(e, row)}>
                      <p>
                        Are you sure you want to Change Role for{" "}
                        <span>{row.userName}</span>?
                      </p>
                      <label htmlFor="chooseDept" className="lableDept">
                        Choose Role:
                      </label>
                      <select
                        name="choose_Dept"
                        id="chooseDept"
                        value={isRole}
                        onChange={(e) => setRole(e.target.value)}
                        style={{
                          color: isTheme ? "#adb5bd" : "#343a40",
                          backgroundColor: isTheme ? "#3e3e3e" : "white",
                        }}
                        className="selectUserDept"
                      >
                        <option value="" selected disabled>
                          SELECT
                        </option>
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                        <option value="Lead">Lead</option>
                        <option value="Admin">Admin</option>
                      </select>
                      <div className="cancel-inactive-div">
                        <button
                          type="button"
                          onClick={() => {
                            setcloseTheRole(false);
                            setRole("");
                          }}
                          className="cancel-btn"
                        >
                          <span className="cancel_btn cancel_icon_align "></span>
                          Close
                        </button>

                        <button type="submit" className="inactive_button">
                          <span className="submit_btn submit_icon_align"></span>
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            <div
              className="status-cell-wrapper"
              onClick={() => handleDeptEdit(row._id)}
            >
              <img
                src={
                  isTheme
                    ? "./src/assets/images/dept-dark.svg"
                    : "./src/assets/images/dept.svg"
                }
                alt=""
                className="ellipsis-icon"
                style={{
                  backgroundColor: isTheme
                    ? "#1714146e"
                    : "rgba(0, 0, 0, 0.05)",
                }}
                title="Change Department"
              />
            </div>

            {isCloseTheDept && activeDept === row._id && (
              <div className="modal-overlay">
                <div
                  className="modal-popup-action-status"
                  style={{
                    backgroundColor: isTheme ? "black" : "white",
                    border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                  }}
                >
                  <div className="popup-content">
                    <div className="heading-one">
                      <h1>Change User Department</h1>
                    </div>
                    <form action="" onSubmit={(e) => changeDept(e, row)}>
                      <p>
                        Are you sure you want to Change Department for{" "}
                        <span>{row.userName}</span>?
                      </p>
                      {/* <input type="text" name="" id="" value={row.department}/> */}
                      <label htmlFor="chooseDept" className="lableDept">
                        Choose Department:
                      </label>
                      {isAllDept && (
                        <select
                          name="choose_Dept"
                          id="chooseDept"
                          value={isDept}
                          onChange={(e) => setDept(e.target.value)}
                          style={{
                            color: isTheme ? "#adb5bd" : "#343a40",
                            backgroundColor: isTheme ? "#3e3e3e" : "white",
                          }}
                          className="selectUserDept"
                        >
                          <option value="" disabled>
                            SELECT
                          </option>
                          {isAllDept.map((deptObj) => (
                            <option
                              key={deptObj._id}
                              value={deptObj.department}
                            >
                              {deptObj.department}
                            </option>
                          ))}
                        </select>
                      )}

                      <div className="cancel-inactive-div">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveDept(false);
                            setDept("");
                          }}
                          className="cancel-btn"
                        >
                          <span className="cancel_btn cancel_icon_align "></span>
                          Close
                        </button>
                        <button type="submit" className="inactive_button">
                          <span className="submit_btn submit_icon_align"></span>
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ),
      ignoreRowClick: true,
      button: true,
    },
  ];

  return (
    <div className="table-container">
      <div className="right-content-usermanagement">
        <div className="user-management-section-one">
          <div className="pageHeadings">
            <span
              className={`userManagementIcon-${
                isTheme ? "dark" : "light"
              } iconUser`}
            ></span>
            <Link to="/usermanagement" onClick={() => setSelectedUser(null)}>
              <h4
                style={{
                  color: isTheme ? "white" : "#283e46",
                }}
              >
                User Management
              </h4>
            </Link>
            {selectedUser && (
              <>
                <img
                  src={
                    isTheme
                      ? "./src/assets/images/breadcrumbs-dark-svgrepo-com.svg"
                      : "./src/assets/images/breadcrumbs-svgrepo-com.svg"
                  }
                  width={18}
                  className="user-management-bread-crumbs"
                />
                <span className="sub-dept sub-dept-user">
                  {selectedUser.userName}'s Referrals
                </span>
              </>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        {selectedUser ? (
          ""
        ) : (
          <div className="tabsAndViewUsers">
            <div
              className={`tabs-container-users tabs-container-users-${
                isTheme ? "dark" : "light"
              }`}
            >
              {["All", "Inactive"].map((status) => (
                <button
                  key={status}
                  value={status}
                  onClick={() => setActiveTab(status)}
                  className={activeTab === status ? "active-tab" : ""}
                >
                  <span
                    className={
                      activeTab === status
                        ? `active-tab tabIcon-${
                            isTheme ? "dark" : "light"
                          } iconTab`
                        : ""
                    }
                  ></span>{" "}
                  {status}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Department Tabs and Search */}
        {selectedUser ? (
          ""
        ) : (
          <div className="filerSearchSection">
            <div className="tabsForCountFilter">
              <div className="tabs-container-dept">
                <button
                  key="All"
                  value="All"
                  onClick={() => setActiveDeptTab("All")}
                  className={activeDeptTab === "All" ? "active-tab" : ""}
                >
                  <span>All</span>
                  <span className="hightLightCount">
                    {Object.values(departmentCounts).reduce(
                      (acc, count) => acc + count,
                      0
                    )}
                  </span>
                </button>
                {allDepartments.map((dept) => (
                  <button
                    key={dept}
                    value={dept}
                    onClick={() => setActiveDeptTab(dept)}
                    className={activeDeptTab === dept ? "active-tab" : ""}
                  >
                    <span>{dept}</span>
                    <span className="hightLightCount">
                      {departmentCounts[dept] || 0}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="search-container">
              <input
                type="text"
                className="searchField"
                placeholder="Search by name or email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ color: isTheme ? "white" : "black" }}
              />
            </div>
          </div>
        )}

        {/* Data Table */}
        <div
          className={`custom-table-wrapper theme-change-${
            isTheme ? "dark" : "theme"
          }`}
          style={{
            "--pagination-icon-color": isTheme ? "white" : "black",
            "--pagination-icon-disabled-color": isTheme ? "#adb5bd" : "#ccc",
            "--pagination-bg": isTheme ? "#495057" : "#fff",
            "--pagination-text-color": isTheme ? "white" : "black",
          }}
        >
          {selectedUser ? (
            <IndividualUserReferrals
              employeeName={selectedUser.userName}
              passData={passData[selectedUser.userName] || []}
            />
          ) : (
            // <div className="custom-table-wrapper">
            //   <DataTable
            //     customStyles={customStyles}
            //     columns={columns}
            //     data={filteredData}
            //     pagination
            //     // selectableRows
            //     // striped
            //     sortIcon={<FaSort />}
            //     defaultSortFieldId={0}
            //     defaultSortAsc={true}
            //     noDataComponent={
            //       <div
            //         style={{
            //           padding: "20px",
            //           textAlign: "center",
            //         }}
            //       >
            //         No data available
            //       </div>
            //     }
            //     // striped
            //   />
            // </div>
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
                    sortIcon={<FaSort />}
                    defaultSortFieldId={0}
                    defaultSortAsc={true}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementForm;
