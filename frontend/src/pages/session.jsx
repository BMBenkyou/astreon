import React from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import SessionBody from "../components/SessionBody";
import "./session.css";

const Session = () => {
  return (
    <div className="MainContaineR">
      {/* Header */}
      <Header />

      <div className="nav-body">
        {/* Sidebar remains persistent */}
        <Sidebar />

        <div className="Bmain-content">
          <SessionBody />
        </div>
      </div>
    </div>
  );
};

export default Session;

