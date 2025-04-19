import React, { useState, useEffect } from "react";
import "./OTPVerification.css";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  // Timer Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle OTP Input
  const handleChange = (index, event) => {
    const value = event.target.value;
    if (!/^\d?$/.test(value)) return; // Allow only digits (0-9)

    let newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next field
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  // Handle Backspace Navigation
  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace") {
      let newOtp = [...otp];
      if (!newOtp[index] && index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  // Submit OTP
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp.join(""));
  };

  return (
    <form className="form" onSubmit={handleSubmit} role="form">
      <div className="content">
        <p align="center">OTP Verification</p>
        <div className="inp">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              className="input"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              aria-label={`Enter OTP digit ${index + 1}`}
              autoComplete="one-time-code"
              inputMode="numeric"
              role="textbox"
            />
          ))}
        </div>
        <button type="submit">Verify</button>
        <svg className="svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#4073ff"
            d="M56.8,-23.9C61.7,-3.2,45.7,18.8,26.5,31.7C7.2,44.6,-15.2,48.2,-35.5,36.5C-55.8,24.7,-73.9,-2.6,-67.6,-25.2C-61.3,-47.7,-30.6,-65.6,-2.4,-64.8C25.9,-64.1,51.8,-44.7,56.8,-23.9Z"
            transform="translate(100 100)"
            className="path"
          ></path>
        </svg>
      </div>
    </form>
  );
};

export default OTPVerification;
