import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { BsChatDots, BsFileEarmark } from "react-icons/bs";
import { MdOutlineQuiz } from "react-icons/md";
import { PiCardsThreeLight } from "react-icons/pi";
import { SiBookstack } from "react-icons/si";
import { AiOutlineSchedule, AiOutlineLike } from "react-icons/ai";
import { FaUserFriends } from "react-icons/fa";
import { TbRobot } from "react-icons/tb";
import "./NSidebar.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);
  const [chatExpanded, setChatExpanded] = useState(false);
  const [practiceExpanded, setPracticeExpanded] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
      setIsOpen(window.innerWidth > 1023);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {isMobile && (
        <div className="bar" onClick={toggleSidebar}>
          <span className={`top ${isOpen ? "active" : ""}`}></span>
          <span className={`middle ${isOpen ? "active" : ""}`}></span>
          <span className={`bottom ${isOpen ? "active" : ""}`}></span>
        </div>
      )}

      <div className={`NSidebar ${isOpen ? "open" : "closed"}`}>
        <nav className="NSidebar-nav">
          {/* Chat Section with Expandable Items */}
          <div className="sidebar-section">
            <div 
              className={`sidebar-header ${chatExpanded ? "expanded" : ""}`}
              onClick={() => setChatExpanded(!chatExpanded)}
            >
              <div className="sidebar-title">
                <BsChatDots className="sidebar-icon" />
                <span>Chat</span>
              </div>
            </div>
            {chatExpanded && (
              <div className="sidebar-submenu">
                <NavLink to="/file-chat" className="sidebar-subitem">
                  <BsFileEarmark className="sidebar-subicon" />
                  <span>Chat with File</span>
                </NavLink>
                <NavLink to="/friend-chat" className="sidebar-subitem">
                  <FaUserFriends className="sidebar-subicon" />
                  <span>Chat with Friend</span>
                </NavLink>
                <NavLink to="/ai" className="sidebar-subitem">
                  <TbRobot className="sidebar-subicon" />
                  <span>Chat with Astreon</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Practice Section with Expandable Items */}
          <div className="sidebar-section">
            <div 
              className={`sidebar-header ${practiceExpanded ? "expanded" : ""}`}
              onClick={() => setPracticeExpanded(!practiceExpanded)}
            >
              <div className="sidebar-title">
                <MdOutlineQuiz className="sidebar-icon" />
                <span>Practice</span>
              </div>
            </div>
            {practiceExpanded && (
              <div className="sidebar-submenu">
                <NavLink to="/quiz" className="sidebar-subitem">
                  <MdOutlineQuiz className="sidebar-subicon" />
                  <span>Quiz</span>
                </NavLink>
                <NavLink to="/flashcards" className="sidebar-subitem">
                  <PiCardsThreeLight className="sidebar-subicon" />
                  <span>Flashcards</span>
                </NavLink>
              </div>
            )}
          </div>

          {/* Sessions Section */}
          <NavLink to="/sessions" className="sidebar-item">
            <SiBookstack className="sidebar-icon" />
            <span>Sessions</span>
          </NavLink>

          {/* Generate Schedule Section */}
          <NavLink to="/genschedule" className="sidebar-item">
            <AiOutlineSchedule className="sidebar-icon" />
            <span>Generate Schedule</span>
          </NavLink>

          {/* Feedback Section */}
          <NavLink to="/feedback" className="sidebar-item">
            <AiOutlineLike className="sidebar-icon" />
            <span>Feedback</span>
          </NavLink>
        </nav>
      </div>
      <div className={`main-content ${!isOpen ? 'sidebar-closed' : ''}`}>
        {/* Your main content will be wrapped here */}
      </div>
    </>
  );
};

export default Sidebar;