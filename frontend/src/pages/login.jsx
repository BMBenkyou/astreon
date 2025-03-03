import React, { useState } from "react";
import { supabase } from "../supabaseClient"; // Make sure to import Supabase client
import { useNavigate } from "react-router-dom";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import "./login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    if (!username || !password) {
      setErrorMessage("Both fields are required!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: username, // Supabase uses email for login
        password,
      });

      if (error) {
        console.error("Login Error:", error.message);
        setErrorMessage(error.message || "Login failed! Please try again.");
        return;
      }

      console.log("Login Success:", data);
      // Redirect to quiz page after successful login
      navigate("/quiz");
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="Opage-container">
      <div className="Ocontainer">
        <div className="Oleft-side">
          <LoginContainer className="Ologin-container">
            <h2 className="Ologin-title">Login</h2>
            {errorMessage && <p className="Oerror-message">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
              <InputGroup
                label={<h5 className="Oemail-label">Username</h5>}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Your Username"
                className="Oinput-field"
                required
              />
              <InputGroup
                label={<h5 className="Opassword-label">Password</h5>}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Your Password"
                className="Oinput-field"
                required
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

      <div className="Oillustration-container">
        <img src="/space-ship.svg" alt="Rocket Illustration" />
      </div>
    </div>
  );
};

export default Login;
