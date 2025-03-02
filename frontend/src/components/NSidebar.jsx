import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./NSidebar.css";
import { TbMessageChatbot } from "react-icons/tb";
import { MdOutlineQuiz } from "react-icons/md";
import { PiCardsThreeLight } from "react-icons/pi";
import { SiBookstack } from "react-icons/si";
import { AiOutlineSchedule, AiOutlineLike } from "react-icons/ai";
import { MdInfoOutline } from "react-icons/md";

const Sidebar = () => {
  const location = useLocation(); // Get the current URL

  return (
    <div className="MSidebar">
      <nav className="MSidebar-nav">
        <NavLink to="/ai-chat" className={`MSidebar-item ${location.pathname === "/ai-chat" ? "active" : ""}`}>
          <TbMessageChatbot />
          Ai Chat
        </NavLink>
        <NavLink to="/quiz" className={`MSidebar-item ${location.pathname === "/quiz" ? "active" : ""}`}>
          <MdOutlineQuiz />
          Quiz
        </NavLink>
        <NavLink to="/flash-cards" className={`MSidebar-item ${location.pathname === "/flash-cards" ? "active" : ""}`}>
          <PiCardsThreeLight />
          Flash Cards
        </NavLink>
        <NavLink to="/sessions" className={`MSidebar-item ${location.pathname === "/sessions" ? "active" : ""}`}>
          <SiBookstack />
          Sessions
        </NavLink>
        <NavLink to="/genschedule" className={`MSidebar-item ${location.pathname === "/generate-schedule" ? "active" : ""}`}>
          <AiOutlineSchedule />
          Generate Schedule
        </NavLink>
        <NavLink to="/help" className={`MSidebar-item ${location.pathname === "/help" ? "active" : ""}`}>
          <MdInfoOutline />
          Help
        </NavLink>
        <NavLink to="/feedback" className={`MSidebar-item ${location.pathname === "/feedback" ? "active" : ""}`}>
          <AiOutlineLike />
          Feedback
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
