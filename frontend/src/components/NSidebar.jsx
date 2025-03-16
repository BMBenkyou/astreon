import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { TbMessageChatbot } from "react-icons/tb";
import { MdOutlineQuiz, MdInfoOutline } from "react-icons/md";
import { PiCardsThreeLight } from "react-icons/pi";
import { SiBookstack } from "react-icons/si";
import { AiOutlineSchedule, AiOutlineLike } from "react-icons/ai";
import "./NSidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1023);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1023);
      setIsOpen(window.innerWidth > 1023); // Sidebar remains open for desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button for Mobile */}
      {isMobile && (
        <div className="bar" onClick={toggleSidebar}>
          <span className={`top ${isOpen ? "active" : ""}`}></span>
          <span className={`middle ${isOpen ? "active" : ""}`}></span>
          <span className={`bottom ${isOpen ? "active" : ""}`}></span>
        </div>
      )}

      {/* Sidebar */}
      <div className={`MSidebar ${isOpen ? "open" : "closed"}`}>
        <nav className="MSidebar-nav">
          <NavLink to="/ai-chat" className={`MSidebar-item ${location.pathname === "/ai-chat" ? "active" : ""}`}>
            <TbMessageChatbot /> <span>AI Chat</span>
          </NavLink>
          <NavLink to="/quiz" className={`MSidebar-item ${location.pathname === "/quiz" ? "active" : ""}`}>
            <MdOutlineQuiz /> <span>Quiz</span>
          </NavLink>
          <NavLink to="/flashcards" className={`MSidebar-item ${location.pathname === "/flashcards" ? "active" : ""}`}>
            <PiCardsThreeLight /> <span>Flash Cards</span>
          </NavLink>
          <NavLink to="/session" className={`MSidebar-item ${location.pathname === "/sessions" ? "active" : ""}`}>
            <SiBookstack /> <span>Sessions</span>
          </NavLink>
          <NavLink to="/genschedule" className={`MSidebar-item ${location.pathname === "/generate-schedule" ? "active" : ""}`}>
            <AiOutlineSchedule /> <span>Generate Schedule</span>
          </NavLink>
          <NavLink to="/help" className={`MSidebar-item ${location.pathname === "/help" ? "active" : ""}`}>
            <MdInfoOutline /> <span>Help</span>
          </NavLink>
          <NavLink to="/feedback" className={`MSidebar-item ${location.pathname === "/feedback" ? "active" : ""}`}>
            <AiOutlineLike /> <span>Feedback</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
