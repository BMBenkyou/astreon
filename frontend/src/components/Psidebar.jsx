import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { LuNotebookText } from "react-icons/lu";
import { VscSettings } from "react-icons/vsc";
import "./Psidebar.css";

const Psidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {isMobile && (
        <div className={`bar2 ${isOpen ? "active" : ""}`} onClick={toggleSidebar}>
          <span className="top"></span>
          <span className="middle"></span>
          <span className="bottom"></span>
        </div>
      )}

      <div className={`Psidebar ${isOpen ? "open" : "closed"}`}>
        <nav className="Psidebar-nav">
          <NavLink
            to="/profile"
            className={`Psidebar-item ${location.pathname === "/profile" ? "active" : ""}`}
          >
            <IoPersonOutline />
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/streak"
            className={`Psidebar-item ${location.pathname === "/streak" ? "active" : ""}`}
          >
            <LuNotebookText />
            <span>Streak</span>
          </NavLink>
          <NavLink
            to="/psettings"
            className={`Psidebar-item ${location.pathname === "/psettings" ? "active" : ""}`}
          >
            <VscSettings />
            <span>Settings</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Psidebar;
