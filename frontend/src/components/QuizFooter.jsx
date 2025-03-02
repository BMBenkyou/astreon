import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import QuizModal from "./QuizModal";
import "./QuizFooter.css";

const QuizFooter = ({ onStartQuiz }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSend = () => {
    if (prompt.trim() !== "") {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="quiz-footer">
        {/* Attachment Button */}
        <button className="footer-btn attach-bton">
          <AiOutlinePaperClip className="footer-icon" />
        </button>

        {/* Input Field */}
        <input
          type="text"
          className="quiz-footer-input"
          placeholder="Generate a quiz based on this file"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Send Button */}
        <button className="send-btn" onClick={handleSend}>
          <div className="svg-wrapper">
            <AiOutlineSend className="footer-icon send-icon" />
          </div>
          <span>Send</span>
        </button>
      </div>

      {/* Modal Component */}
      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptText={prompt}
        onStartQuiz={() => {
          setIsModalOpen(false); // Close modal
          onStartQuiz(); // Trigger quiz start
        }}
      />
    </>
  );
};

export default QuizFooter;
