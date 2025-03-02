import React, { useState } from "react";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import "./signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Signing up with", username, password);
  };

  return (
    <div className="Tpage-container">
      {/* Sign Up Form Container */}
      <div className="Tcontainer">
        <div className="Tleft-side">
          <LoginContainer className="Tsignup-container">
            <h2 className="Tsignup-title">Sign Up</h2>
            <form onSubmit={handleSignup}>
              <InputGroup
                label={<h5 className="Temail-label">Username or Email</h5>}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="Tinput-field"
              />
              
              {/* Password Field */}
              <InputGroup
                label={<h5 className="Tpassword-label">Password</h5>}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="Tinput-field"
              >
                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "/src/assets/eye.svg" : "/src/assets/eyebrow.svg"}
                    alt={showPassword ? "Hide password" : "Show password"}
                  />
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </InputGroup>

              {/* Confirm Password Field */}
              <InputGroup
                label={<h5 className="Tconfirm-password-label">Confirm Password</h5>}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field"
              >
                <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <img
                    src={showConfirmPassword ? "/src/assets/eye.svg" : "/src/assets/eyebrow.svg"}
                    alt={showConfirmPassword ? "Hide password" : "Show password"}
                  />
                  <span>{showConfirmPassword ? "Hide" : "Show"}</span>
                </button>
              </InputGroup>

              <Button type="submit">Sign Up</Button>

              <p className="Tregister-link">
                Already have an account? <a href="/login">Click Here</a>
              </p>
            </form>
          </LoginContainer>
        </div>
      </div>

      {/* Separate Illustration Container */}
      <div className="Tillustration-container">
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default Signup;