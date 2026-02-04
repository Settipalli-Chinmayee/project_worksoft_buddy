import React from "react";
import submitted from "../../assets/images/submitted.svg";
import emailed from "../../assets/images/emailed.svg";
import group_discussion from "../../assets/images/group_discussion.svg";
import technicalStatus from "../../assets/images/technicalStatus.svg";
import hrStatus from "../../assets/images/hrStatus.svg";
import rejectedStatus from "../../assets/images/rejectedStatus.svg";
import selectedStatusImg from "../../assets/images/selectedStatus.svg";

const ReferralStatus = ({ selectedStatus, displaysIn, pageName }) => {
  const listOfStatus = [
    {
      status: "Submitted",
      color: "#343a40",
      backgroundColor: "#ebebec",
      imgSource: submitted,
      alt: "Submitted",
    },
    {
      status: "Emailed",
      color: "#0d6efd",
      backgroundColor: "#cfe2ff",
      imgSource: emailed,
      alt: "Emailed",
    },
    {
      status: "Group Discussion",
      color: "#17a2b8",
      backgroundColor: "#e8f6f8",
      imgSource: group_discussion,
      alt: "Group Discussion",
    },
    {
      status: "Technical Assessment",
      color: "#007bff",
      backgroundColor: "#e6f2ff",
      imgSource: technicalStatus,
      alt: "Technical Assessment",
    },
    {
      status: "HR Round",
      color: "#fd7e14",
      backgroundColor: "#fff2e8",
      imgSource: hrStatus,
      alt: "HR Round",
    },
    {
      status: "Rejected",
      color: "#dc3545",
      backgroundColor: "#fcebec",
      imgSource: rejectedStatus,
      alt: "Rejected",
    },
    {
      status: "Selected",
      color: "#28a745",
      backgroundColor: "#eaf6ec",
      imgSource: selectedStatusImg,
      alt: "Selected",
    },
    {
      status: "Pending",
      color: "#ffc107",
      backgroundColor: "#fff9e6",
      imgSource: "../src/assets/images/pending.svg",
      alt: "Pending",
    },
  ];

  const selectedStyle = listOfStatus.find(
    (item) => item.status === selectedStatus
  );

  return (
    <div
      style={{
        color: selectedStyle?.color,
        backgroundColor: selectedStyle?.backgroundColor,
        padding:
          pageName === "view"
            ? "0.4em 0.6em"
            : displaysIn === "view"
            ? "0em 0.6em"
            : "0.5em 0.6em",
        borderRadius: pageName === "view" ? "25px" :"25px",
        border: pageName === "view" ? `0.6px solid ${selectedStyle?.color}` :"none",
        // textAlign: "center",
        fontSize: displaysIn === "view" ? "0.9em" : "1em",
        display: "flex",
        justifyContent: pageName === "view" && "center" ,
        alignItems: "center",
        gap: "0.4em",
        // justifyContent: "center",
      }}
    >
      {selectedStyle?.imgSource && (
        <img
          src={selectedStyle.imgSource}
          alt={selectedStyle.alt}
          style={{ width: "16px", height: "16px" }}
        />
      )}
      <span className="ellipsis-text" title={selectedStatus}>
        {selectedStatus}
      </span>
    </div>
  );
};

export default ReferralStatus;
