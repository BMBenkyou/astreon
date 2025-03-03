import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import { supabase } from "../supabaseClient";
import "./signup.css";

// Initialize Supabase client


const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null); // State for success messages
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: username,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // If email confirmation is required
        if (data?.user?.identities?.length === 0) {
          setSuccess('Please check your email for the confirmation link!');
        } else {
          // If email confirmation is not required, redirect to quiz page
          navigate('/quiz');
        }
      }
    } catch (error) {
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="Tpage-container">
      {/* Sign Up Form Container */}
      <div className="Tcontainer bg-gradient-to-b from-[#dce6eb] to-[#c3faf1] p-8 rounded-lg shadow-lg">
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

              {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
              {success && <p className="text-green-500">{success}</p>} {/* Display success message */}

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