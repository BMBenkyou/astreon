import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { useState, useEffect } from "react";
import "./signup.css";

export function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    accept_policy: false,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[!@#$%^&*]/)) strength += 25;

    if (strength <= 25) return { text: "Weak", color: "#ff4d4d" };
    if (strength <= 50) return { text: "Medium", color: "#ffd700" };
    if (strength <= 75) return { text: "Strong", color: "#2ecc71" };
    return { text: "Very Strong", color: "#27ae60" };
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [id]: newValue });

    if (id === "password") {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Form Data:", formData);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/dj-rest-auth/registration/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password1: formData.password,
          password2: formData.confirm_password,
        }),
      });
  
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);
  
      if (!response.ok) {
        throw new Error(data?.non_field_errors || "An error occurred.");
      }
  
      setSuccess(true);
    } catch (err) {
      console.error("Error:", err.message);
      setError(err.message);
    }
  };
  

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
  }, [success]);

  if (success) {
    return (
      <div className="signup_form">
        <h2>Sign-up successful! Please check your email to verify your account.</h2>
        <p>You will be redirected to the login page in 3 seconds.</p>
      </div>
    );
  }

  return (
    <>
      <Header buttons={[{ anchorText: "Login", link: "/login" }]} />
      <form className="signup_form" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="strength-meter">
          <div
            className="strength-bar"
            style={{
              width: `${
                passwordStrength
                  ? passwordStrength.text === "Weak"
                    ? "25%"
                    : passwordStrength.text === "Medium"
                    ? "50%"
                    : passwordStrength.text === "Strong"
                    ? "75%"
                    : "100%"
                  : "0%"
              }`,
              backgroundColor: passwordStrength.color,
            }}
          ></div>
        </div>
        <p id="strength-text" style={{ color: passwordStrength.color }}>
          {passwordStrength.text}
        </p>

        <label htmlFor="confirm_password">Confirm Password</label>
        <input
          type="password"
          id="confirm_password"
          placeholder="Confirm Password"
          value={formData.confirm_password}
          onChange={handleChange}
          required
        />

        <div className="privacy_policy">
          <input
            type="checkbox"
            name="accept_policy"
            id="accept_policy"
            checked={formData.accept_policy}
            onChange={handleChange}
            required
          />
          <label>
            By creating an account, you agree to our Terms of Service and Privacy
            Policy.
          </label>
        </div>

        <div className="submit_sign_up">
        <button type="submit">Sign Up</button>
        </div>
      </form>

      <Footer />
    </>
  );
}