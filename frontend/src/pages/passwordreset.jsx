import React, { useState } from "react";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import "./passwordreset.css";

const PasswordReset = () => {
  const [email, setEmail] = useState("");

  const handleResetRequest = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email address!");
      return;
    }
    console.log("Password reset request sent for:", email);
    alert("A password reset link has been sent to your email.");
  };

  return (
    <div className="Hpage-container">
      {/* Password Reset Form Container */}
      <div className="Hcontainer">
        <div className="Hleft-side">
          <LoginContainer className="Hpasswordreset-container">
            <h2 className="Hpasswordreset-title">Password Reset</h2>
            <form onSubmit={handleResetRequest}>
              <InputGroup
                label={<h5 className="Hpasswordreset-label">Email</h5>}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email Address"
                className="Hinput-field"
              />
              <Button type="submit">Send Request</Button>
            </form>
          </LoginContainer>
        </div>
      </div>

      {/* Separate Illustration Container */}
      <div className="Hillustration-container">
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default PasswordReset;
