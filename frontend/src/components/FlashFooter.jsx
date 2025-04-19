import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import FlashModal from "./FlashcardModel";
import "./FlashFooter.css";

const FlashFooter = ({ onStartFlash }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSend = () => {
    if (prompt.trim() !== "") {
      setIsModalOpen(true);
      setPrompt(""); // Clear input field
    }
  };

  return (
    <>
      <div className="flash-footer">
        {/* Attachment Button */}
        <button className="footer-btn attach-boton" onClick={() => document.getElementById('attach-file').click()}>
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
          className="flash-footer-input"
          placeholder="Generate a flashcard based on this file"
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
      <FlashModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptText={prompt}
        onStartFlash={() => {
          setIsModalOpen(false); // Close modal
          onStartFlash(); // Trigger Flash start
        }}
      />
    </>
  );
};

export default FlashFooter;

