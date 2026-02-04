import React from "react";
import "../LandingPage/landingpage.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  document.title = "Qualesce | HR Portal";


  return (
    <>
      {/* Fixed Header Section (Logo & Buttons) */}
      <div className="fixed-header">
        <div className="logo">
          <img
            src="./src/assets/images/qualesceLogo.svg"
            className="logo-img"
            alt="Logo"
          />
          <div>
          </div>
        </div>
        <div className="nav-links">
          <Link to="/login" className="btn-link" title="Your Virtual Assistant">
            HR Bot
          </Link>
          <Link
            to="/referralLogin"
            className="btn-link"
            title="Intuitive Referring Platform"
          >
            Referral Portal
          </Link>
        </div>
      </div>

      {/* Full-screen container for the main heading */}
      <div className="mainCon">
        <div className="main-contents">
          <div className="main-heading">
            <h1>
              <span>All-in-one HR </span>
              <br />
              <span>Platform</span>
            </h1>
          </div>
        </div>
        <div className="main-tagline">
          <p>
          Streamline all your HR processes and deliver exceptional employee
          experiences
          </p>
          
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati recusandae vel quasi eum vitae, impedit culpa exercitationem voluptas temporibus asperiores.</p>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="scrollable-content">
        {/* HR Bot Section */}
        <div className="section">
          <img
            src="./src/assets/images/botimage_head.svg"
            alt="HR Bot"
            className="section-img"
            width="30em"
          />
          <div className="sec-Content">
            <p className="sec-heading">HR Bot</p>
            <span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla, maxime facere. Id unde veniam deleniti.</span>
            <Link to="/" className="btn-link-explore">
              Explore HR Bot
            </Link>
          </div>
        </div>

        {/* Referral Portal Section */}
        <div className="section">
          <div className="sec-Content">
            <p className="sec-heading">Referral Portal</p>
            <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste accusamus facere perferendis, commodi maiores similique?</span>
            <Link to="/referralLogin" className="btn-link-explore">
              Explore Referral Portal
              {/* <img src="./src/assets/images/login.svg" alt=""  /> */}
            </Link>
          </div>
          <img
            src="./src/assets/images/referralimage.svg"
            alt="Referral Portal"
            className="section-img"
            width="30em"
          />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
