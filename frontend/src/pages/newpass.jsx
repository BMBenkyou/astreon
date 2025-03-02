import React, { useState } from "react";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import "./newpass.css";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      alert("Please fill in both fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Password reset successfully with:", password);
    alert("Your password has been reset successfully!");
  };

  return (
    <div className="Fpage-container">
      {/* New Password Form Container */}
      <div className="Fcontainer">
        <div className="Fleft-side">
          <LoginContainer className="Fnewpass-container">
            <h2 className="Fnewpass-title">Set a New Password</h2>
            <form onSubmit={handlePasswordReset}>
              {/* New Password Field */}
              <InputGroup
                label={<h5 className="Fnew-password-label">New Password</h5>}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Finput-field"
              >
                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "/src/assets/eyebrow.svg" : "/src/assets/eye.svg"}
                    alt={showPassword ? "Hide password" : "Show password"}
                  />
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </InputGroup>

              {/* Confirm Password Field */}
              <InputGroup
                label={<h5 className="Fnew-confirm-password-label">Confirm Password</h5>}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="Finput-field"
              >
                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? "/src/assets/eyebrow.svg" : "/src/assets/eye.svg"}
                    alt={showConfirmPassword ? "Hide password" : "Show password"}
                  />
                  <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                </button>
              </InputGroup>

              <Button type="submit">Confirm Password Reset</Button>
            </form>
          </LoginContainer>
        </div>
      </div>

      {/* Separate Illustration Container */}
      <div className="Fillustration-container">
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default NewPassword;
