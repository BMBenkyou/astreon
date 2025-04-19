import React, { useState } from "react";
import OTPVerification from "../components/OTPVerification";
import "./verification.css";

// Verification component
const Verification = () => {
  return (
    <div className="Opage-container">
      {/* Verification Form */}
      <div className="Ocontainer">
        <div className="Oleft-side">
          {/* OTP Verification component */}
          <OTPVerification />
        </div>
      </div>

      {/* Illustration */}
      <div className="Oillustration-container">
        {/* Image of rocket */}
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default Verification;

