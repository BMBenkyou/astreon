import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai"; // Import icons
import "./QuizFooter.css";

const QuizFooter = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="quiz-footer">
      {/* Attachment Button */}
      <button className="footer-btn attach-bton">
        <AiOutlinePaperClip className="footer-icon" />
      </button>

      {/* Input Field */}
      <input
        type="text"
        className="quiz-footer-input"
        placeholder="Generate me a multiple questions quiz based on this file"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      {/* Send Button */}
      <button className="send-btn">
        <div className="svg-wrapper">
          <AiOutlineSend className="footer-icon send-icon" />
        </div>
        <span>Send</span>
      </button>
    </div>
  );
};

export default QuizFooter;
