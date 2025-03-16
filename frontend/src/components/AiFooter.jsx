import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import "./AiFooter.css";

const AIFooter = ({ onSendMessage }) => {
  const [prompt, setPrompt] = useState("");

  const handleSend = () => {
    if (prompt.trim() !== "") {
      onSendMessage(prompt); // Send message to parent component
      setPrompt(""); // Clear input field
    }
  };

  return (
    <div className="ai-footer">
      {/* Attachment Button */}
      <button className="footer-btn attach-btn" onClick={() => document.getElementById('attach-file').click()}>
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
        className="ai-footer-input"
        placeholder="Ask me anything"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
      />

      {/* Send Button */}
      <button className="send-btn" onClick={handleSend}>
        <div className="svg-wrapper">
          <AiOutlineSend className="footer-icon send-icon" />
        </div>
        <span>Send</span>
      </button>
    </div>
  );
};

export default AIFooter;
