import React from "react";
import { FaArrowRightLong } from "react-icons/fa6"; // Import icon
import "./SessionBody.css";

const sessionData = [
  {
    category: "Quizzes",
    cards: ["RVA", "Math", "English", "Science"],
  },
  {
    category: "Flashcards",
    cards: ["DSA", "Algo", "Lorem", "Lorem"],
  },
  {
    category: "AI Sessions",
    cards: ["Lorem"],
  },
];

const SessionBody = () => {
  return (
    <div className="session-body">
      {sessionData.map((section, index) => (
        <div key={index} className="session-category">
          <h2 className="category-title">{section.category}</h2>
          <div className="card-row">
            {section.cards.map((card, idx) => (
              <div key={idx} className="session-card">
                <h3>{card}</h3>
                <p>Didn't find anything? Create your own system suitable for your needs</p>
                <div className="card__arrow">
                  <FaArrowRightLong className="arrow-icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SessionBody;
