import React from "react";
import { NavLink } from "react-router-dom";
import { IoPersonOutline } from "react-icons/io5";
import { LuNotebookText } from "react-icons/lu";
import { VscSettings } from "react-icons/vsc";
import "./Psidebar.css";

const Psidebar = () => {
  return (
    <div className="Psidebar">
      <nav className="Psidebar-nav">
        <NavLink to="/profile" className="Psidebar-item">
          <IoPersonOutline className="w-8 h-8 mr-2" />
          Profile
        </NavLink>
        <NavLink to="/streak" className="Psidebar-item">
          <LuNotebookText className="w-8 h-8 mr-2" />
          Streak
        </NavLink>
        <NavLink to="/psettings" className="Psidebar-item">
          <VscSettings className="w-8 h-8 mr-2" />
          Settings
        </NavLink>
      </nav>
    </div>
  );
};

export default Psidebar;
