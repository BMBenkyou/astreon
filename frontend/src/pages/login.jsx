import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import GoogleLoginButton from "../components/GoogleLoginButton";
import "./login.css";  // You'll need to create this file

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setErrors({});

  try {
    const response = await fetch("http://localhost:8080/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = await response.json();
    console.log("Login response:", data); 

    if (response.ok) {
      if (data.access) {
        localStorage.setItem("accessToken", data.access); 
        console.log("Stored Access Token:", data.access);

        // Redirect to ai chat page after login
        window.location.href = "/ai-chat"; 
      } else {
        console.error("Access token is missing in response.");
      }
    } else {
      setErrors(data);
      console.error("Login failed:", data);
    }
  } catch (error) {
    console.error("Login error:", error);
  } finally {
    setIsLoading(false);
  }
};
 

  const getFieldError = (fieldName) => {
    return errors[fieldName] ? 
      <div className="error-message">{errors[fieldName].join(' ')}</div> : null;
  };

  const getNonFieldErrors = () => {
    return errors.non_field_errors ? 
      <div className="error-message general">{errors.non_field_errors.join(' ')}</div> : null;
  };

  return (
    <div className="Tpage-container">
      <div className="Tcontainer">
        <div className="Tleft-side">
          <LoginContainer className="Tlogin-container">
            <h2 className="Tlogin-title">Login</h2>
            
            {getNonFieldErrors()}
            
            
            <form onSubmit={handleLogin}>
              <InputGroup
                label={<h5 className="Tusername-label">Username or Email</h5>}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="Tinput-field"
              />
              {getFieldError('username')}

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
              {getFieldError('password')}

              <div className="forgot-password">
                <a href="/password-reset">Forgot Password?</a>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <p className="Tregister-link">
                Don't have an account? <a href="/signup">Sign Up</a>
              </p>
            </form>
          </LoginContainer>
        </div>
      </div>

      <div className="Tillustration-container">
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default Login;