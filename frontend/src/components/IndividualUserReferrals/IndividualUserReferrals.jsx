import React, { useState, useEffect, useContext } from "react";
import TableSkeleton from "../AllReferrals/TableSkeleton";
import DataTable from "react-data-table-component";
import { FaSort } from "react-icons/fa";
import ReferralStatus from "../ReferralStatus/ReferralStatus";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import PdfThemeLightIcon from "../../assets/images/pdfLightThemeIcon.svg";
import PdfThemeDarkIcon from "../../assets/images/pdfDarkThemeIcon.svg";

const IndividualUserReferrals = ({ employeeName, passData }) => {
  const [loading, setLoading] = useState(false);
  const [referralsWithAvatars, setReferralsWithAvatars] = useState([]);
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
  useEffect(() => {
    const fetchAvatars = async () => {
      setLoading(true);
      const updated = await Promise.all(
        passData.map(async (ref) => {
          const avatarUrl = await getAvatarUrl(
            ref.referral_fname,
            ref.referral_lname
          );
          return { ...ref, avatarUrl };
        })
      );
      setReferralsWithAvatars(updated);
      setLoading(false);
    };

    if (passData?.length > 0) {
      fetchAvatars();
    }
  }, [passData]);

  const getAvatarUrl = async (firstName, lastName) => {
    try {
      const fullName = lastName?.trim()
        ? `${firstName} ${lastName}`
        : firstName;
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

  const columns = [
    {
      name: <div style={{ textAlign: "center", width: "100%" }}>Name</div>,
      selector: (row) => row.referral_fname + " " + row.referral_lname,
      sortable: true,
      grow: 0,
      minWidth: "250px",
      maxWidth: "500px",
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
      selector: (row) => row.status || "N/A",
      sortable: true,
      center: true,
      minWidth: "180px",
      maxWidth: "200px",

      grow: 0,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ width: "fit-content" }}>
            <ReferralStatus selectedStatus={row.status} />
          </div>
        ),
    },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Department</div>
      ),
      selector: (row) => row.department,
      sortable: true,
      wrap: true,
      cell: (row) =>
        loading ? (
          <TableSkeleton />
        ) : (
          <div style={{ textAlign: "center", width: "100%" }}>
            {row.department}
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
    // {
    //   name: <div style={{ textAlign: "center", width: "100%" }}>Referred By</div>,
    //   selector: (row) => row.referred_by,
    //   sortable: true,
    //   cell: (row) =>
    //     loading ? (
    //       <TableSkeleton />
    //     ) : (
    //       <div style={{ textAlign: "center", width: "100%" }}>
    //         {row.referred_by || "N/A"}
    //       </div>
    //     ),
    // },
    {
      name: (
        <div style={{ textAlign: "center", width: "100%" }}>Employee Type</div>
      ),
      selector: (row) => row.employment_type,
      sortable: true,
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
        <div style={{ textAlign: "center", width: "100%" }}>Referred Date</div>
      ),
      selector: (row) => row.created_at,
      sortable: true,
      cell: (row) => {
        if (loading) return <TableSkeleton />;
        if (!row.created_at) return "N/A";

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
  ];

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

  return (
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
      <div className="custom-table-wrapper">
        <DataTable
          customStyles={customStyles}
          columns={columns}
          data={referralsWithAvatars}
          pagination
          // striped
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
          sortIcon={<FaSort />}
          defaultSortFieldId={0}
          defaultSortAsc={true}
          progressPending={loading}
        />
      </div>
    </div>
  );
};

export default IndividualUserReferrals;
