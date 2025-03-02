import React from "react";
import Header from "../components/NHeader";
import Psidebar from "../components/Psidebar";
import SettingsPreferences from "../components/SettingsPreferences"; // Import Preferences Component
import "./psettings.css";

const Settings = () => {
  return (
    <div className="schedule-container">
      {/* Header */}
      <Header />

      <div className="nav-body">
        {/* Sidebar */}
        <Psidebar />

        {/* Main content */}
        <div className="main-content">
          <SettingsPreferences /> {/* Add Preferences Form */}
        </div>
      </div>
    </div>
  );
};

export default Settings;

