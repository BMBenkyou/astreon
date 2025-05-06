import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import for navigation
import LoginContainer from "../components/LoginContainer";
import InputGroup from "../components/InputGroup";
import Button from "../components/Button";
import "./signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({}); // For better error handling
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // For redirection after signup

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Client-side validation checks
    const newErrors = {};
    if (!email) {
      newErrors.email = ["Email is required."];
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(email)) {
        newErrors.email = ["Please enter a valid email."];
      }
    }

    if (!username) {
      newErrors.username = ["Username is required."];
    }

    if (!password) {
      newErrors.password = ["Password is required."];
    } else if (password !== confirmPassword) {
      newErrors.password = ["Passwords do not match!"];
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = ["Please confirm your password."];
    }

    // If there are client-side validation errors, update the state and prevent API call
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for API request
    const data = {
      username,
      email,
      password1: password,
      password2: confirmPassword,
    };

    setIsLoading(true);

    try {
      // Send POST request to Django backend
      const response = await fetch("http://localhost:8080/api/auth/registration/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: 'include', // Include cookies if your API uses them
      });

      const result = await response.json();

      if (response.ok) {
        // Successful signup
        console.log("Signup successful:", result);
        navigate('/login'); // Redirect to login page

        // Store token if provided
        if (result.key) {
          localStorage.setItem('authToken', result.key);
        }

        alert("Signup successful! Please check your email to verify your account.");
      } else {
        // Handle validation errors from Django REST
        console.error("Signup error:", result);
        setErrors(result);
        // Do NOT redirect here, as the signup on the backend failed.
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ non_field_errors: ["An error occurred during signup. Please try again."] });
      // Do NOT redirect here, as there was a network or other client-side error.
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to collect all error messages
  const getAllErrorMessages = () => {
    if (Object.keys(errors).length === 0) return null;

    const errorMessages = [];

    // Collect all error messages from different fields
    Object.keys(errors).forEach(key => {
      if (Array.isArray(errors[key])) {
        errors[key].forEach(error => {
          errorMessages.push(`${key === 'non_field_errors' ? '' : key + ': '}${error}`);
        });
      } else if (typeof errors[key] === 'string') {
        errorMessages.push(`${key}: ${errors[key]}`);
      }
    });

    if (errorMessages.length === 0) return null;

    return (
      <div className="error-messages-container">
        {errorMessages.map((message, index) => (
          <div key={index} className="error-message">{message}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="Tpage-container">
      {/* Sign Up Form Container */}
      <div className="Tcontainer">
        <div className="Tleft-side">
          <LoginContainer className="Tsignup-container">
            <h2 className="Tsignup-title">Sign Up</h2>

            {/* Consolidated error messages */}
            {getAllErrorMessages()}

            <form onSubmit={handleSignup}>
              {/* Email Field */}
              <InputGroup
                label={<h5 className="Temail-label">Email</h5>}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="Tinput-field"
              />

              {/* Username Field */}
              <InputGroup
                label={<h5 className="Tusername-label">Username</h5>}
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

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Signing Up..." : "Sign Up"}
              </Button>

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