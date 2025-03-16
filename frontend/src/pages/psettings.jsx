import React from "react";
import Header from "../components/NHeader";
import Psidebar from "../components/Psidebar";
import SettingsPreferences from "../components/SettingsPreferences";
import "./psettings.css";

const Settings = () => {
  return (
    <div className="schedule-container">
      {/* Header */}
      <Header />

      <div className="PPnav-body">
        {/* Sidebar */}
        <Psidebar />

        {/* Main content */}
        <div className="PPmain-content">
          <SettingsPreferences />
        </div>
      </div>
    </div>
  );
};

export default Settings;
