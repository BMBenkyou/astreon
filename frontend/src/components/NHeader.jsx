import "./NHeader.css";
import { CgProfile } from "react-icons/cg";
import { IoMdCalendar } from "react-icons/io";

const Header = () => {
  return (
    <header className="header">
      {/* Left side: Logo */}
      <div className="logo">
        <img src="../src/assets/logo.svg" alt="Astreon Logo" />
      </div>

      {/* Right side: Calendar and Profile */}
      <div className="right-section">
        <IoMdCalendar className="calendar" />

        <div className="profile-icon">
          <a href="/profile">
            <CgProfile className="profile-icon" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
