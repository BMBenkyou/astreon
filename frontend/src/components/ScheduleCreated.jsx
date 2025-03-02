import React from "react";
import "./ScheduleCreated.css";

const ScheduleCreated = () => {
  return (
    <div className="main-container">
      <div className="schedule-grid">
        {/* First row */}
        <div className="purple-box"></div>
        <div className="purple-box"></div>
        <div className="purple-box"></div>

        {/* Second row */}
        <div className="blue-box"></div>
        <div className="blue-box"></div>
        <div className="blue-box"></div>

        {/* Third row */}
        <div className="purple-box"></div>
        <div className="purple-box"></div>
        <div className="purple-box"></div>
      </div>
    </div>
  );
};

export default ScheduleCreated;
