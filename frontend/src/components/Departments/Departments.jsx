import React, { useContext, useEffect, useState } from "react";
import "./Departments.css";
import DataTable from "react-data-table-component";
import TableSkeleton from "../AllReferrals/TableSkeleton";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useAuth } from "../UserContext/UserContext";
import { ThemeContext } from "../ThemeContext/ThemeContext";

const Departments = () => {
    document.title = "HR Referral Portal | Department"

  // const navigate = useNavigate()
  const { authState } = useAuth();

  const { isTheme } = useContext(ThemeContext);
  // console.log("Auth state:", authState);
  const userName = authState?.user?.userName || "Guest";
  const userRoleAccess = authState?.user?.userRole;
  const userStatus = authState?.user?.status;
  const userId = authState?.user?.userId;
  // console.log(userStatus, "userStatus");
  const [isError, setError] = useState("");
  const [isDept, setIsDept] = useState(false);
  const [isDepartment, setDepartment] = useState("");
  const [isSkills, setIsSkills] = useState("");
  const [isRole, setIsRole] = useState("");
  const [openIsSkills, setOpenSkills] = useState(false);
  const [isAboutDept, setAboutDept] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState("");
  const [isDeptAbout, setIsAboutDept] = useState("");
  const [allDept, setAllDept] = useState([]);
  const [isAbout, setIsAbout] = useState("");

  const [isUpdateDept, setUpdateDept] = useState(false);
  const [isUpdateSub, setUpdateSub] = useState(false);
  const [deptId, setDeptId] = useState("");
  const [isSubDept, setSubDept] = useState(false);
  const [isSubDepartment, setIsSubDept] = useState("");
  const [isActions, setIsActions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeVal, setActiveVal] = useState(null);
  const [isUpdateSubDept, setUpdateSubDept] = useState(false);
  const [isSubDeptId, setSubDeptId] = useState("");
  const [isDeptId, setIsDeptId] = useState("");
  const [idSub, setIdSub] = useState("");
  const [isDeptDetails, setDeptDetails] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentSubSlide, setCurrentSubSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerSlide = 2;

  const sampleColumns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
      width: "120px",
    },
    {
      name: "Customer",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.customerEmail,
      wrap: true,
    },
  ];

  const addDepartment = () => {
    setIsDept(true);
    // console.log("Add Departments");
  };

  const openSkills = () => {
    // console.log("Open Skills");
    setOpenSkills(true);
  };
  const openRoles = () => {
    // console.log("Open Roles");
  };

  const getDept = async (e) => {
    e.preventDefault();
    if (isDepartment === "" || isDeptAbout === "") {
      setError("All Feilds are required");
      return;
    }
    const data = {
      department: isDepartment,
      about: isDeptAbout,
    };
    const id = deptId;
    // console.log(id);
    // console.log(data);
    try {
      const response = await fetch(
        isUpdateDept
          ? `http://localhost:3000/api/v1/referral/updateDepartments/${id}`
          : "http://localhost:3000/api/v1/referral/addDepartments",
        {
          method: isUpdateDept ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        const newDept = await response.json();
        closeModal();
        closeEdit();
        setDepartment("");
        setIsAboutDept("");
        setIsDept(false);
        fetchDepartments();
        setError("");
      } else {
        // If server responds with error, try to parse the error message from response
        const errorData = await response.json();
        setError(errorData.message || `Error: ${response.status}`);
        console.log("Server error:", errorData.message || response.status);
      }
    } catch (error) {
      console.log("Fetch error:", error.message);
      setError(error.message);
    }
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
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        throw new Error("Failed to fetch data");
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const getsubDept = async (e) => {
    e.preventDefault();
    if (isSubDepartment === "" || isSkills === "") {
      setError("All Feilds are required");
      return;
    }
    const subDeptData = {
      subDepartment: isSubDepartment,
      skills: isSkills,
    };
    // console.log(subDeptData);
    const idDept = isDeptId;
    const subId = idSub;
    // console.log(idDept)
    try {
      const response = await fetch(
        isUpdateSub
          ? `http://localhost:3000/api/v1/referral/addSubDepartments/${idDept}/${subId}`
          : `http://localhost:3000/api/v1/referral/addSubDepartments/${idDept}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subDeptData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        fetchDepartments();
        closeSub();
        setIsSubDept("");
        setIsSkills("");
        setUpdateSub(false);
        setError("");
      } else {
        if (response.status === 409) {
          setError(result.message);
        } else {
          setError(result.message || "Failed to add/update sub-department");
        }
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
      setError("Something went wrong. Please try again.");
      // setError(error.message)
    }
  };

  const closeModal = () => {
    setIsDept(false);
    setDepartment("");
    setIsAboutDept("");
    setError("");
  };
  const aboutDept = (department, about, id, subDepartments) => {
    setAboutDept(true);
    setBreadcrumb(`${department}`);
    setIsAbout(about);
    setIsDeptId(id);
    // console.log(subDepartments);
    setDeptDetails(subDepartments);
  };
  const closeDept = () => {
    setAboutDept(false);
    setError("");
  };

  const goBack = () => {
    setBreadcrumb(false);
  };

  const updateDept = (index, dept) => {
    // console.log(dept);
    setUpdateDept(true);
    setDepartment(dept.department);
    setIsAboutDept(dept.about);
    setDeptId(dept._id);
    setError("");
  };

  const updateSubDept = (val, subDept) => {
    // console.log(subDept);
    setUpdateSub(true);
    setIsSubDept(subDept.subDepartment);
    setIsSkills(subDept.skills);
    setIdSub(subDept._id);
    setError("");
  };

  const closeEdit = () => {
    setUpdateDept(false);
    setError("");
  };
  const closeModalSub = () => {
    setUpdateSub(false);
    setIsSubDept("");
    setIsSkills("");
    setError("");
  };
  const closeSub = () => {
    setSubDept(false);
    setError("");
    setIsSubDept("");
    setIsSkills("");
  };

  const subDepartment = (id) => {
    // console.log(id);
    setSubDeptId(id);
    setSubDept(true);
  };

  const viewAction = (index) => {
    // console.log(index);
    // setActiveIndex(index)
    // setIsActions(true);
    if (activeIndex === index) {
      setIsActions(false);
      setActiveIndex(null);
    } else {
      // Show the actions menu for the clicked index
      setActiveIndex(index);
      setIsActions(true);
    }
  };

  const viewSubAction = (val) => {
    if (activeVal === val) {
      setIsActions(false);
      setActiveVal(null);
    } else {
      setActiveVal(val);
      setIsActions(true);
    }
  };

  const nextSlide = () => {
    // console.log(Math.floor(allDept.length / itemsPerSlide), "length");
    // console.log(currentSlide, "length current");
    if (currentSlide < Math.floor(allDept.length / itemsPerSlide)) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentDepartments = allDept.slice(
    currentSlide * itemsPerSlide,
    (currentSlide + 1) * itemsPerSlide
  );

  const nextUp = () => {
    // console.log(isDeptDetails.length,"is")
    if (currentSubSlide < Math.floor(isDeptDetails.length / itemsPerSlide)) {
      setCurrentSubSlide(currentSubSlide + 1);
    }
  };

  const prevData = () => {
    if (currentSubSlide > 0) {
      setCurrentSubSlide(currentSubSlide - 1);
    }
  };

  const currentSubDepartments = isDeptDetails.slice(
    currentSubSlide * itemsPerSlide,
    (currentSubSlide + 1) * itemsPerSlide
  );

  return (
    <div className="main-container">
      <ReferralSidebar onTap={goBack} />
      <div className="main-content">
        <div className="table-container scroll-container">
          {breadcrumb ? (
            <div>
              <div className="user-management-section-one">
                <div className="pageHeadings">
                  <h4 className="deptHead">
                    <div className="bread-crumbs">
                      <span
                        className="dept_name"
                        onClick={goBack}
                        style={{
                          cursor: "pointer",
                          color: isTheme ? "white" : "#283e46",
                        }}
                      >
                        {breadcrumb}{" "}
                      </span>
                      <img
                        src={
                          isTheme
                            ? "./src/assets/images/breadcrumbs-dark-svgrepo-com.svg"
                            : "./src/assets/images/breadcrumbs-svgrepo-com.svg"
                        }
                        alt=""
                        width={18}
                      />
                      <span className="sub-dept">
                        {" "}
                        Sub-Departments{" "}
                        {/* <img
                        src="./src/assets/images/cancel.svg"
                        width={18}
                        alt=""
                      /> */}
                      </span>
                    </div>
                  </h4>
                </div>
                {userRoleAccess !== "Employee" && (
                  <div>
                    <p
                      className="invite-user-btn"
                      onClick={() => subDepartment(isDeptId)}
                    >
                      <img
                        src="./src/assets/images/add-circle-svgrepo-com(1).svg"
                        alt=""
                        width={20}
                      />{" "}
                      Sub-Department
                    </p>
                  </div>
                )}
              </div>
              <div>
                {isUpdateSub && (
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
                      <form
                        action="#"
                        className="hire-form formUI"
                        onSubmit={getsubDept}
                        autoComplete="off"
                      >
                        <p
                          className="formHeading"
                          style={{ color: isTheme ? "white" : "#283e46" }}
                        >
                          {breadcrumb} Department
                        </p>
                        <label
                          htmlFor="deptName"
                          style={{ color: isTheme ? "white" : "#283e46" }}
                        >
                          Department Name
                        </label>
                        <input
                          style={{
                            color: isTheme ? "#adb5bd" : "#343a40",
                          }}
                          type="text"
                          name="dept"
                          id="deptName"
                          value={isSubDepartment}
                          onChange={(e) => setIsSubDept(e.target.value)}
                        />

                        <label
                          htmlFor="deptSkills"
                          style={{ color: isTheme ? "white" : "#283e46" }}
                        >
                          Skills
                        </label>
                        <input
                          style={{
                            color: isTheme ? "#adb5bd" : "#343a40",
                          }}
                          type="text"
                          name="skill"
                          id="deptSkills"
                          value={isSkills}
                          onChange={(e) => setIsSkills(e.target.value)}
                        />
                        <div style={{ textAlign: "center" }}>
                          {isError && (
                            <>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <img
                                  src="./src/assets/images/error.svg"
                                  // className="error-icon"
                                  width={16}
                                  alt="Error"
                                />
                                <span
                                  role="alert"
                                  style={{ color: "red", fontSize: "14px" }}
                                >
                                  {isError}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="button-hire">
                          <button
                            className="cancel-btn"
                            type="button"
                            onClick={closeModalSub}
                          >
                            <span className="cancel_btn cancel_icon_align "></span>
                            Cancel
                          </button>
                          <button className="submitButton" type="submit">
                            <span className="update_btn submit_icon_align"></span>
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
              {isSubDept && (
                <div className="modal-overlay">
                  <div
                    className="modal-box"
                    style={{
                      backgroundColor: isTheme ? "black" : "white",
                      border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                    }}
                  >
                    <form
                      action="#"
                      className="hire-form formUI"
                      onSubmit={getsubDept}
                      autoComplete="off"
                    >
                      <p
                        className="formHeading"
                        style={{ color: isTheme ? "white" : "#283e46" }}
                      >
                        {breadcrumb} Department
                      </p>
                      <label
                        htmlFor="deptName"
                        style={{ color: isTheme ? "white" : "#283e46" }}
                      >
                        Department Name
                      </label>
                      <input
                        style={{
                          color: isTheme ? "#adb5bd" : "#343a40",
                        }}
                        type="text"
                        name="dept"
                        id="deptName"
                        value={isSubDepartment}
                        onChange={(e) => setIsSubDept(e.target.value)}
                      />

                      <label
                        htmlFor="deptSkills"
                        style={{ color: isTheme ? "white" : "#283e46" }}
                      >
                        Skills
                      </label>
                      <input
                        style={{
                          color: isTheme ? "#adb5bd" : "#343a40",
                        }}
                        type="text"
                        name="skill"
                        id="deptSkills"
                        value={isSkills}
                        onChange={(e) => setIsSkills(e.target.value)}
                      />
                      <div style={{ textAlign: "center" }}>
                        {isError && (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <img
                                src="./src/assets/images/error.svg"
                                // className="error-icon"
                                width={16}
                                alt="Error"
                              />
                              <span
                                role="alert"
                                style={{ color: "red", fontSize: "14px" }}
                              >
                                {isError}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="button-hire">
                        <button
                          className="cancel-btn"
                          type="button"
                          onClick={closeSub}
                        >
                          {" "}
                          <span className="cancel_btn cancel_icon_align "></span>
                          Cancel
                        </button>
                        <button className="submitButton" type="submit">
                          <span className="submit_btn submit_icon_align"></span>
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div className="breadcrumb">
                {/* <p className="breadcrumb-p"></p> */}
                {/* <div className="bread-about">{isAbout}</div> */}
              </div>
              <div className="subDepartments">
                <div className="">
                  <div>
                    {isDeptDetails && isDeptDetails.length > 0 ? (
                      <div className="dept-cards">
                        {currentSubDepartments.map((subDept, val) => (
                          <div key={val} className="eachCard subEachCard">
                            <div className="deptName">
                              <div className="departmentsCard subDeptCard">
                                <div className="dept-head">
                                  <h1>{subDept.subDepartment}</h1>
                                </div>
                              </div>

                              <div
                                className="deptAbout"
                                style={{
                                  color: isTheme ? "white" : "#08080899",
                                }}
                              >
                                {subDept.skills.map((skill, val) => (
                                  <p key={val}>{skill}</p>
                                ))}
                              </div>
                              <div className="action-btn">
                                {userRoleAccess !== "Employee" && (
                                  <img
                                    src={
                                      isTheme
                                        ? "./src/assets/images/dots-h-svgrepo-dark-com.svg"
                                        : "./src/assets/images/dots-h-svgrepo-com.svg"
                                    }
                                    alt="actions"
                                    width={32}
                                    onClick={() => viewSubAction(val)}
                                  />
                                )}

                                {isActions && activeVal === val && (
                                  <div className="action-btn-sub">
                                    <p
                                      onClick={() =>
                                        updateSubDept(val, subDept)
                                      }
                                      style={{
                                        color: isTheme ? "white" : "black",
                                      }}
                                    >
                                      Modify Sub Department
                                    </p>
                                    {/* <p>hi</p> */}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{color:isTheme ? "white":"black"}}>No Sub-Departments Available</p>
                    )}
                  </div>
                  <div className="slide-buttons">
                    <button
                      onClick={prevData}
                      className="prevBtn"
                      disabled={currentSubSlide === 0}
                    >
                      <div className="slide-back">
                        <img
                          src="./src/assets/images/downward-svgrepo-com.svg"
                          alt=""
                          width={32}
                        />
                      </div>
                    </button>
                    <button
                      className="nexr-btn"
                      onClick={nextUp}
                      disabled={
                        currentSubSlide ===
                        Math.floor(isDeptDetails.length / itemsPerSlide)
                      }
                    >
                      <div className="slide-back">
                        <img
                          src="./src/assets/images/next-svgrepo-com(1).svg"
                          alt=""
                          width={32}
                        />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="user-management-section-one">
                <div className="pageHeadings">
                  <h4
                    style={{
                      cursor: "pointer",
                      color: isTheme ? "white" : "#283e46",
                    }}
                  >
                    {" "}
                    <span
                      className={`departmentIcon-${
                        isTheme ? "dark" : "light"
                      } icon dept-icon`}
                    ></span>
                    Departments
                  </h4>
                </div>
                {userRoleAccess !== "Employee" && (
                  <div>
                    <p className="invite-user-btn" onClick={addDepartment}>
                      <img
                        src="./src/assets/images/add-circle-svgrepo-com(1).svg"
                        alt=""
                        width={20}
                      />{" "}
                      Department
                    </p>
                  </div>
                )}
              </div>
              {loading ? (
                <SkeletonTheme
                  baseColor={isTheme ? "#4b556380" : "#e0e0e0"}
                  highlightColor={isTheme ? "#6b7280" : "#f5f5f5"}
                >
                  <div className="dept-cards">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="departmentsCard">
                        <div className="eachCard">
                          <div className="deptName">
                            <div className="dept-head">
                              <Skeleton circle={true} height={40} width={40} />
                              <h1>
                                <Skeleton width="60%" />
                              </h1>
                            </div>
                          </div>
                          <div>
                            <Skeleton
                              count={3}
                              height={10}
                              width="80%"
                              className="my-2 rounded-full"
                              // style={{backgroundColor: isTheme ? "black" : "red"}}
                            />
                          </div>
                          <div className="action-btn">
                            <Skeleton width={40} height={20} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SkeletonTheme>
              ) : allDept.length > 0 ? (
                <div className="dept-cards">
                  {/* <div>left</div> */}
                  {currentDepartments.map((dept, index) => (
                    <div key={index} className="departmentsCard">
                      <div className="eachCard">
                        <div
                          className="deptName"
                          // onClick={() => aboutDept(dept.department, dept.about)}
                        >
                          <div className="dept-head">
                            <img src="./src/assets/images/qlogo.svg" alt="" />
                            <h1
                            // onClick={() =>
                            //   aboutDept(dept.department, dept.about)
                            // }
                            >
                              {dept.department}
                            </h1>
                          </div>
                        </div>
                        <div>
                          <p
                            className="deptAbout"
                            style={{ color: isTheme ? "white" : "#08080899" }}
                          >
                            {dept.about}
                          </p>
                        </div>
                        <div className="action-btn">
                          {userRoleAccess !== "Employee" && (
                            <img
                              src={
                                isTheme
                                  ? "./src/assets/images/dots-h-svgrepo-dark-com.svg"
                                  : "./src/assets/images/dots-h-svgrepo-com.svg"
                              }
                              alt="actions"
                              width={32}
                              onClick={() => viewAction(index)}
                            />
                          )}

                          {isActions && activeIndex === index && (
                            <div className="act_btn">
                              <p
                                onClick={() => updateDept(index, dept)}
                                style={{ color: isTheme ? "white" : "black" }}
                              >
                                Modify Department
                              </p>
                            </div>
                          )}
                          {/* <p onClick={() => updateDept(index, dept)}>Update</p> */}
                          <div
                            className="change-img"
                            onClick={() =>
                              aboutDept(
                                dept.department,
                                dept.about,
                                dept._id,
                                dept.subDepartments
                              )
                            }
                          >
                            <p
                              className={`read-img-${
                                isTheme ? "dark" : "light"
                              }`}
                            ></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* <div>right</div> */}
                </div>
              ) : (
                <p style={{color:isTheme ? "white":"black"}}>No Departments available</p>
              )}

              <div className="slide-buttons">
                <button
                  onClick={prevSlide}
                  className="prevBtn"
                  disabled={currentSlide === 0}
                >
                  {/* Previous */}
                  <div className="slide-back">
                    <img
                      src="./src/assets/images/downward-svgrepo-com.svg"
                      alt=""
                      width={32}
                    />
                  </div>
                </button>
                <button
                  className="nexr-btn"
                  onClick={nextSlide}
                  disabled={
                    currentSlide === Math.floor(allDept.length / itemsPerSlide)
                  }
                >
                  {/* Next */}
                  <div className="slide-back">
                    <img
                      src="./src/assets/images/next-svgrepo-com(1).svg"
                      alt=""
                      width={32}
                    />
                  </div>
                </button>
              </div>
            </div>
          )}

          {isDept && (
            <div className="modal-overlay">
              <div
                className="modal-box"
                style={{
                  backgroundColor: isTheme ? "black" : "white",
                  border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                }}
              >
                <form
                  action="#"
                  className="hire-form formUI"
                  onSubmit={getDept}
                  autoComplete="off"
                >
                  <p
                    className="formHeading"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    Department
                  </p>
                  <label
                    htmlFor="deptName"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    Department Name
                  </label>
                  <input
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                    }}
                    type="text"
                    name="dept"
                    id="deptName"
                    value={isDepartment}
                    required
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <label
                    htmlFor="deptAbout"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    About
                  </label>
                  <textarea
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                      resize: "none",
                      height: "10em",
                    }}
                    type="text"
                    name="dept_About"
                    id="deptAbout"
                    value={isDeptAbout}
                    onChange={(e) => setIsAboutDept(e.target.value)}
                  ></textarea>
                  <div style={{ textAlign: "center" }}>
                    {isError && (
                      <>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <img
                            src="./src/assets/images/error.svg"
                            // className="error-icon"
                            width={16}
                            alt="Error"
                          />
                          <span
                            role="alert"
                            style={{ color: "red", fontSize: "14px" }}
                          >
                            {isError}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="button-hire">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={closeModal}
                    >
                      <span className="cancel_btn cancel_icon_align "></span>
                      Cancel
                    </button>
                    <button className="submitButton " type="submit">
                      <span className="submit_btn submit_icon_align"></span>
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {isUpdateDept && (
            <div className="modal-overlay">
              <div
                className="modal-box"
                style={{
                  backgroundColor: isTheme ? "black" : "white",
                  border: isTheme ? "1px solid #8d8d8d" : "1px solid white",
                }}
              >
                <form
                  action="#"
                  className="hire-form formUI"
                  onSubmit={getDept}
                  autoComplete="off"
                >
                  <p
                    className="formHeading"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    Department
                  </p>
                  <label
                    htmlFor="deptName"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    Department Name
                  </label>
                  <input
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                    }}
                    type="text"
                    name="dept"
                    id="deptName"
                    value={isDepartment}
                    required
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                  <label
                    htmlFor="deptAbout"
                    style={{ color: isTheme ? "white" : "#283e46" }}
                  >
                    About
                  </label>
                  <textarea
                    style={{
                      color: isTheme ? "#adb5bd" : "#343a40",
                      resize: "none",
                      height: "10em",
                    }}
                    type="text"
                    name="dept_About"
                    id="deptAbout"
                    value={isDeptAbout}
                    onChange={(e) => setIsAboutDept(e.target.value)}
                  ></textarea>
                  <div style={{ textAlign: "center" }}>
                    {isError && (
                      <>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <img
                            src="./src/assets/images/error.svg"
                            // className="error-icon"
                            width={16}
                            alt="Error"
                          />
                          <span
                            role="alert"
                            style={{ color: "red", fontSize: "14px" }}
                          >
                            {isError}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="button-hire">
                    <button
                      className="cancel-btn"
                      type="button"
                      onClick={closeEdit}
                    >
                      <span className="cancel_btn cancel_icon_align "></span>
                      Cancel
                    </button>
                    <button className="submitButton" type="submit">
                      <span className="update_btn submit_icon_align"></span>
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Departments;
