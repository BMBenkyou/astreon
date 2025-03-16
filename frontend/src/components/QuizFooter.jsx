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
        <button className="footer-btn attach-bton" onClick={() => document.getElementById('attach-file').click()}>
          <AiOutlinePaperClip className="footer-icon" />
        </button>
        <input
          type="file"
          id="attach-file"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              // Handle the file upload logic here
              console.log("File attached:", file.name);
            }
          }}
        />

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
