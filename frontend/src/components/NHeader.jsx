import { useState } from "react";
import "./NHeader.css";
import { CgProfile } from "react-icons/cg";
import { IoMdCalendar } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      {/* Left side: Logo */}
      <div className="logo">
        <img src="../src/assets/logo.svg" alt="Astreon Logo" />
      </div>

      {/* Right side: Calendar and Profile */}
      <div className="right-section">
        <IoMdCalendar className="calendar" />

        {/* Profile Dropdown */}
        <div className="profile-container" onClick={toggleDropdown}>
          <div className="profile-icon">
              <CgProfile className="profile-icon" />
          </div>
          <IoIosArrowDown className="dropdown-icon" />

          {/* Dropdown Menu */}
          <div className={`dropdown-menu ${isDropdownOpen ? "active" : ""}`}>
            <ul className="list">
              <li className="element">
                <CgProfile />
                <a href="/profile">Profile</a>
              </li>
              <hr className="separator" />
              <li className="element">
                <IoLogOutOutline />
                <a href="/login">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
