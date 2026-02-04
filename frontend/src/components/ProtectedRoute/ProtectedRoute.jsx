import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../UserContext/UserContext";

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();

  // If still loading the auth state, you can return a loading indicator
  if (authState.user === null) {
    const storedUser = localStorage.getItem("userDetails");
    if (storedUser) {
      return children; // Let it render if user was found in localStorage
    } else {
      return <Navigate to="/referralLogin" />;
    }
  }

  return children;
};

export default ProtectedRoute;
