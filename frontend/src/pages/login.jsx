import React, { useState } from "react";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with", username, password);
  };

  return (
    <div className="Opage-container">
      {/* Login Form */}
      <div className="Ocontainer">
        <div className="Oleft-side">
          <LoginContainer className="Ologin-container">
            <h2 className="Ologin-title">Login</h2>
            <form onSubmit={handleLogin}>
              <InputGroup
                label={<h5 className="Oemail-label">Email</h5>}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Your Email"
                className="Oinput-field"
              />
              <InputGroup
                label={<h5 className="Opassword-label">Password</h5>}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="Oinput-field"
              >
                <button
                  type="button"
                  className="show-hide-btn flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img
                    src={showPassword ? "/src/assets/eye.svg" : "/src/assets/eyebrow.svg"}
                    alt={showPassword ? "Eye asleep" : "Eye awake"}
                    className="w-4 h-4 mr-2"
                  />
                  <span>{showPassword ? "Hide" : "Show"}</span>
                </button>
              </InputGroup>
              <p className="Oforgot-password">
                Forget Password? <a href="/passwordreset">Click here</a>
              </p>
              <Button type="submit">Login</Button>
              <p className="Oregister-link">
                Don't have an account? <a href="/signup">Sign up now</a>
              </p>
            </form>
          </LoginContainer>
        </div>
      </div>

      {/* Illustration */}
      <div className="Oillustration-container">
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default Login;

