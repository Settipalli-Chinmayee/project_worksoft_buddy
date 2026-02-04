import React from "react";
// import UserManagementTable from '../UserManagementTable/UserManagementTable'
import Sidebar from "../SideBar/SideBar";
import UserManagementForm from "../UserManagementForm/UserManagementForm";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";

const UserManagement = () => {
  return (
    <>
      <div className="main-container">
        <ReferralSidebar />
        <div className="main-content">
          <UserManagementForm/>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
