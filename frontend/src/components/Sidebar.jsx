import { useState } from "react";
import { FaQuestionCircle, FaRegStickyNote, FaCalendarAlt, FaInfoCircle, FaThumbsUp, FaUserGraduate } from "react-icons/fa";

const Sidebar = () => {
  const [active, setActive] = useState("ai-chat");

  const menuItems = [
    { id: "quiz", label: "Quiz", icon: <FaQuestionCircle /> },
    { id: "flashcards", label: "Flashcards", icon: <FaRegStickyNote /> },
    { id: "sessions", label: "Sessions", icon: <FaCalendarAlt /> },
    { id: "generate-schedule", label: "Generate Schedule", icon: <FaCalendarAlt /> },
    { id: "help", label: "Help", icon: <FaInfoCircle /> },
    { id: "feedback", label: "Feedback", icon: <FaThumbsUp /> },
  ];

  return (
    <div className="w-[260px] h-auto p-4 rounded-[20px] border border-gray-300 shadow-lg bg-gradient-to-b from-[#E0F2F1] to-gray-300">
      {/* AI Chat Button */}
      <div
        onClick={() => setActive("ai-chat")}
        className="w-full bg-green-500 text-white font-semibold text-center py-3 rounded-lg cursor-pointer"
      >
        AI Chat
      </div>

      {/* Sidebar Menu */}
      <div className="mt-3 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all text-gray-700 ${
              active === item.id ? "bg-gray-200 font-semibold" : "hover:bg-gray-200"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
