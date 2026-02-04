import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ReferralContext = createContext();

export const useReferral = () => useContext(ReferralContext);

export const ReferralProvider = ({ children }) => {
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [referralStatusCount, setReferralStatusCount] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const referralCountByStatus = (users) => {
    const counts = {};
    users.forEach((user) => {
      const status = user.status;
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  };

  const fetchCurrent = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/api/v1/referral/currentReferrals",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.status === 403) {
        navigate("/*");
        return;
      }

      const data = await response.json();

      if (data.logout) {
        navigate("/referralLogin");
        return;
      }

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

      const usersWithAvatars = await Promise.all(
        data.map(async (user) => {
          const initials = user.referral_fname[0] + user.referral_lname[0];
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
            console.error("Error fetching avatar", err);
            return user;
          }
        })
      );

      const statusCounts = referralCountByStatus(usersWithAvatars);
      setUserData(usersWithAvatars);
      setFilteredData(usersWithAvatars);
      setReferralStatusCount(statusCounts);
    } catch (error) {
      console.error("Error fetching referral data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrent();
  }, []);

  return (
    <ReferralContext.Provider
      value={{
        userData,
        filteredData,
        referralStatusCount,
        fetchCurrent,
        loading,
      }}
    >
      {children}
    </ReferralContext.Provider>
  );
};
