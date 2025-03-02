import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import FilePreview from "../components/FilePreview";
import CustomCalendar from "../components/CustomCalendar";
import "./genschedule.css";

const GenerateSchedule = () => {
  const location = useLocation(); // Get the current page URL
  console.log("Current Path:", location.pathname); // Debugging, shows "/generate-schedule"

  return (
    <div className="MainContainer">
      {/* Header */}
      <Header />

      <div className="nav-body">
        {/* Sidebar remains persistent */}
        <Sidebar />

        <div className="main-content">
          <div className="content-wrapper">
            <FilePreview />
            <div className="calendar-section">
              <CustomCalendar />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateSchedule;
