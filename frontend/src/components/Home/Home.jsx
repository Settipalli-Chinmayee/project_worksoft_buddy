import { useContext } from "react";
import ReferralSidebar from "../ReferralSidebar/ReferralSidebar";
import { ThemeContext } from "../ThemeContext/ThemeContext";
import { useAuth } from "../UserContext/UserContext";
import "./Home.css";

const Home = () => {
      document.title = "HR Referral Portal | Home"

  const { isTheme } = useContext(ThemeContext);
  const { authState } = useAuth();
  const userName = authState?.user?.userName;
  // console.log(userName);

  return (
    <>
      <div className="main-container">
        <ReferralSidebar />
        <div
          className="main-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <div className="home-content" style={{ width: "30em" }}>
            <p
              style={{
                color: isTheme ? "white" : "black",
                textAlign: "left",
              }}
            >
              {/* Welcome to the Referral Portal <strong>{userName},</strong> This
              platform enables you to extend invitations to peers, or
              professional contacts who may benefit from our services.You can
              use this space to share your unique referrals monitor the progress
              of those you’ve referred.We value the trust you place in our
              organization by introducing others to us, and we are committed to
              ensuring a seamless and professional referral experience. */}
              <span
                style={{
                  fontSize: "32px",
                  color: isTheme ? "white":"#264653",
                }}
              >
                {" "}
                Welcome{" "}
                <span className="user_name">
                  <strong style={{color: isTheme ? "#ffc300":"#264653", textTransform:"capitalize"}}>{userName}</strong>
                </span>
                ,
              </span>
              <p className="topHeadingTwo" style={{color: isTheme ? "white":"#264653",}}>
                We appreciate your support in helping us identify qualified
                candidates for our team.
              </p>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
