import React, { useContext } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import TableSkeleton from "../AllReferrals/TableSkeleton";

const ViewReferralTable = ({ detailsToDisplay, updatedBy, themeDetails }) => {
  console.log("from view", detailsToDisplay.updatedAt);
  console.log("from updates", updatedBy);
  console.log("theme", themeDetails);
  console.log("length", detailsToDisplay.length);
  const { isTheme } = useContext(ThemeContext);
  // the row data
  const detailsToUpdate = detailsToDisplay.updateDetails.map(
    (details, index) => {
      return {
        updatedBy: updatedBy[index] || details.updatedBy,
        updateReason: details.isReason,
        updatedAt: details.updatedAt,
      };
    }
  );

  console.log(detailsToUpdate);

  function formatDateWithTime(dateString) {
    const date = new Date(dateString);

    const time = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const formatted = `${String(date.getDate()).padStart(
      2,
      "0"
    )}-${date.toLocaleString("en-GB", {
      month: "short",
    })}-${date.getFullYear()}, ${time}`;

    return formatted;
  }

  console.log(detailsToUpdate);
  //   process.exit(1)

  // the haeder
  const columns = [
    {
      name: "Reviewer",
      selector: (row) => row.updatedBy,
      //   sortable: true,
      minWidth: "80px", // This will reduce the column size
      maxWidth: "150px", // Limiting the maximum width
      cell: (row) => (
        <div
          style={{
            paddingLeft: "16px",
            paddingRight: "16px",
            whiteSpace: "normal",
            textTransform: "capitalize",
            // backgroundColor: "blue"
          }}
          title={row.updatedBy} // optional: show full name on hover
        >
          {row.updatedBy}
        </div>
      ),
    },
    {
      name: "Comments",
      selector: (row) => row.updateReason,
      //   sortable: true,
      grow: 2.8,
      // paddingRight: "15px",
      cell: (row) => (
        <div
          title={row.updateReason}
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            textAlign: "justify",
            lineHeight: "1.5",
          }}
        >
          {row.updateReason}
        </div>
      ),
    },

    {
      id: "updatedAt", //
      name: "Date & Time",
      selector: (row) => row.updatedAt,
      style: {
        // marginLeft: "10px", // or any value you want
      },
      sortable: true,
      cell: (row) => formatDateWithTime(row.updatedAt),
    },
  ];

  const customStyles = {
    table: {
      style: {
        width: "98%",
        borderCollapse: "collapse",
        margin: "0 1% 0 1%",
        backgroundColor: "#f8f8f8",
        border: isTheme ? "1px solid #6c757d" : "1px solid #ddd", // border around the whole table container

        // border: "1px solid #ddd", // border around the whole table container
        // fontSize: "1em",
        // overf

        // margin: "10px"
      },
    },
    header: {
      style: {
        // dark background if dark theme
        color: themeDetails ? "#eee" : "#000", // light text if dark theme
        // color: isTheme ? "white" : "#283e46",
        backgroundColor: themeDetails ? "#495057" : "#fff",
        fontWeight: "bold",
        fontSize: "14px",
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
        borderRight: "1px solid #d8d8d8", // Light row divider
        // backgroundColor: "#e9ecef", // Optional light background
        border: isTheme ? "1px solid #6c757d" : "1px solid #d8d8d8",
        backgroundColor: isTheme ? "#212529" : "#e9ecef",
        // backgroundColor: "#f2f2f2",
        //       borderRight: '0.5 px solid #ccc', // ✅ Only affects header
        // backgroundColor: "#d9d9d9"
      },
    },
    rows: {
      style: {
        minHeight: "60px", // for all rows
        backgroundColor: isTheme ? "#343a40" : "#fff",
        color: isTheme ? "white" : "#333",
      },
    },
    cells: {
      style: {
        padding: "0px 4px",
        // paddingRight: "16px",
        whiteSpace: "normal",
        fontSize: "14px",
      },
    },

    cells: {
      style: {
        // color: isTheme ? "white" : "#283e46",
        // borderRight: "1px solid #d8d8d8", // Light row divider
        color: isTheme ? "white" : "#283e46",
        // borderRight: "1px solid #d8d8d8", // Light row divider
        borderRight: isTheme ? "1px solid #6c757d" : "1px solid #d8d8d8", // Light row divider
        borderBottom: isTheme ? "1px solid #6c757d" : "none",
      },
    },
    pagination: {
      style: {
        // backgroundColor: "red",
        width: "98%",
        minHeight: "0px",
        margin: "0 1% 0 1%",
        color: isTheme ? "white" : "black",
        backgroundColor: isTheme ? "black" : "#fff",

        // borderBottomLeftRadius: "6px",
        // borderBottomRightRadius: "6px",
        // borderBottom:"1px solid grey"
      },
    },
  };

  // create the built-in dark theme (optional customization)
  createTheme("dark", {
    text: {
      primary: "#FFFFFF",
      secondary: "#B2B2B2",
    },
    background: {
      default: "#121212",
    },
    context: {
      background: "#333",
      text: "#FFFFFF",
    },
    divider: {
      default: "#444",
    },
    action: {
      button: "rgba(255,255,255,.54)",
      hover: "rgba(255,255,255,.08)",
      disabled: "rgba(255,255,255,.12)",
    },
  });

  return (
    <>
      {/* <DataTable
        // title="Referral Update Logic" //Table title displayed at the top
        columns={columns} // Column configuration (headers, selectors, sorting, etc.)
        data={detailsToUpdate} //  Actual data to display in the table
        // customStyles={customStyles} //  Optional: custom styling for header, rows, etc.
        pagination // Adds pagination at the bottom of the table
        highlightOnHover //  Highlights row on mouse hover
        responsive //  Makes the table responsive on small screens
        // selectableRows //  Adds checkboxes to each row for selection
        // onSelectedRowsChange={
        //   (state) => console.log("Selected Rows:", state.selectedRows) //  Callback when selected rows change (returns selected rows)
        // }
        // theme="dark" // add theme
        defaultSortFieldId="updatedAt"
        defaultSortAsc={false} // false = descending (most recent first)
      />{" "} */}
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
        <DataTable
          columns={columns}
          data={detailsToUpdate}
          pagination
          paginationPerPage={3}
          // highlightOnHover
          fixedHeader
          // fixedHeaderScrollHeight="300px" // height for 3 rows * 60px
          responsive
          defaultSortFieldId="updatedAt"
          defaultSortAsc={false}
          customStyles={customStyles}
          theme={themeDetails ? "dark" : "default"} // Use "default" for light theme
        />
      </div>
    </>
  );
};

export default ViewReferralTable;
