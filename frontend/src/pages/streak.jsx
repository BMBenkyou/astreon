import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "../components/NHeader";
import Psidebar from "../components/Psidebar";
import StreakNtatistics from "../components/StreakNStats";

import "./streak.css";

// Define the Profile component
const Profile = () => {
  // Separate state for each password field
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // Define isScheduleCreated or replace it with a real condition
  const isScheduleCreated = false; // Placeholder: Change based on your logic

  return (
    <div className="schedule-container">
      {/* Header */}
      <Header />

      {/* Nav Body: persistent sidebar and body content */}
      <div className="nav-body">
        {/* Sidebar remains persistent */}
        <Psidebar />

        {/* StreakNtatistics component in the body */}
        <StreakNtatistics />
      </div>
    </div>
  );
};

export default Profile;

