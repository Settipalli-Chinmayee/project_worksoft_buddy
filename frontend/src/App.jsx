import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page_Not_Found from "./components/PagenotFound/Page_Not_Found";
import Login from "./components/Login/Login";
import Forgotpassword from "./components/ForgotPassword/Forgotpassword";
import Signup from "./components/Signup/Signup";
import Logout from "./components/Logout/Logout";
import Settings from "./components/Settings/Settings";
import { useState } from "react";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import ChatInterface from "./components/ChatInterface/ChatInterface";
import Referral_Login from "./components/Referral_Login/Referral_Login";
import LandingPage from "./components/LandingPage/LandingPage";
import Hiring from "./components/Hiring/Hiring";
import JobHires from "./components/JobHires/JobHires";
import ReferralSignup from "./components/ReferralSignup/ReferralSignup";
import AllReferrals from "./components/AllReferrals/AllReferrals";
// import WorksoftDept from "./components/WorksoftDept/WorksoftDept";
// import BluePrismDept from "./components/BluePrismDept/BluePrismDept";
// import WebDevDept from "./components/WebDevDept/WebDevDept";
import UserManagement from "./components/UserManagement/UserManagement";
import IndividualUserReferrals from "./components/IndividualUserReferrals/IndividualUserReferrals";
import Departments from "./components/Departments/Departments";

import { AuthProvider } from "./components/UserContext/UserContext";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Current from "./components/Current/Current";
import { ThemeProvider } from "./components/ThemeContext/ThemeContext";
import ForgotReferralpassword from "./commonFolder/ForgotReferralpassword/ForgotReferralpassword";
import Page_otp from "./components/Page_otp/Page_otp";
import Home from "./components/Home/Home";
import { ReferralProvider } from "./components/ReferralContext/ReferralContext";
// import NewInterface from "./components/ChatInterface/NewInterface";

function App() {
  // const name = import.meta.env.VITE_NAME
  // console.log("NAME from .env file :",name)

  return (
    <>
      <BrowserRouter>
        <ReferralProvider>
          <ThemeProvider>
            <AuthProvider>
              <Routes>
                <Route path="/signup" element={<Signup />}></Route>
                <Route path="/" element={<Login />}></Route>
                <Route
                  path="/referralLogin"
                  element={<Referral_Login />}
                ></Route>
                {/* <Route path="/newChat" element={<NewInterface />}></Route> */}
                <Route
                  path="/otp"
                  element={
                    <ProtectedRoute>
                      <Page_otp />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/referralSignup"
                  element={<ReferralSignup />}
                ></Route>
                <Route path="/home" element={<Home />}></Route>

                <Route
                  path="/allReferrals"
                  element={
                    <ProtectedRoute>
                      <AllReferrals />
                    </ProtectedRoute>
                  }
                ></Route>
                {/* <Route path="/hirings" element={<Hirings />}></Route> */}
                {/* <Route path="/worsoftdept" element={<WorksoftDept />}></Route>
            <Route path="/blueprismdept" element={<BluePrismDept />}></Route>
            <Route path="/webdevdept" element={<WebDevDept />}></Route> */}
                <Route
                  path="/usermanagement"
                  element={
                    <ProtectedRoute>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/indivdualReferrals"
                  element={
                    <ProtectedRoute>
                      <IndividualUserReferrals />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/department"
                  element={
                    <ProtectedRoute>
                      <Departments />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/allJobs"
                  element={
                    <ProtectedRoute>
                      <JobHires />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/current"
                  element={
                    <ProtectedRoute>
                      <Current />
                    </ProtectedRoute>
                  }
                ></Route>
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                ></Route>
                {/* <Route path="/" element={<LandingPage />}></Route> */}
                {/* <Route path="/hrbot" element={<ChatInterface />}></Route> */}
                <Route path="/worksoftBuddy" element={<ChatInterface />}></Route>
                <Route
                  path="/forgotPassword"
                  element={<Forgotpassword />}
                ></Route>
                <Route
                  path="/forgotReferralPassword"
                  element={<ForgotReferralpassword />}
                ></Route>
                <Route path="/logout" element={<Logout />}></Route>
                <Route path="/settings" element={<Settings />}></Route>
                {/* <Route path="/chatHistory" element={<ChatHistory />}></Route> */}
                <Route
                  path="/resetPassword/:token"
                  element={<ResetPassword />}
                ></Route>
                <Route
                  path="/resetPassword"
                  element={<ResetPassword />}
                ></Route>
                <Route path="*" element={<Page_Not_Found />}></Route>
              </Routes>
            </AuthProvider>
          </ThemeProvider>
        </ReferralProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
