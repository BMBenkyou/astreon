import React, { useEffect, useRef } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import "./AiBody.css";

const suggestions = [
  {
    title: "Study Methods",
    description: "Get tailored advice on different study methods",
  },
  {
    title: "Spaced Repetition",
    description: "Learn how spaced repetition works and integrate it",
  },
  {
    title: "Study Materials",
    description: "Find study materials suitable for you",
  },
  {
    title: "Create System",
    description: "Didn't find anything? Create your own system suitable for your needs",
  },
];

const AiBody = ({ messages }) => {
  const chatContainerRef = useRef(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="ai-body">
      {/* Hide title and cards if there are messages */}
      {messages.length === 0 && (
        <div>
          <div className="ai-body__header">
            <h1>What would you like to learn today?</h1>
            <p>Get guidance powered by AI agents on how you can maximize your productivity with studying effectively.</p>
          </div>

          <div className="ai-body__cards">
            {suggestions.map((item, index) => (
              <div key={index} className="card">
                <h3 className="card__title">{item.title}</h3>
                <p className="card__content">{item.description}</p>
                <div className="card__arrow">
                  <FaArrowRightLong className="arrow-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "user" ? "user-message" : "ai-message"}`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};
export default AiBody;

