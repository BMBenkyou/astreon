import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import FlashModal from "./FlashcardModel";
import "./FlashFooter.css";

const FlashFooter = ({ title, description, onStartFlash }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSend = async () => {
    if (prompt.trim() !== "" || selectedFile) {
      const formData = new FormData();
      formData.append("title", title || "Flashcard Set");
      formData.append("description", description || "");
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("prompt", prompt);
      
      const token = localStorage.getItem('accessToken');  
      if (!token) {
        console.error("No access token found");
        return;
      }
     
      try {
        const response = await fetch("http://127.0.0.1:8080/api/flashcard/generate/", {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("currentFlashcards", JSON.stringify(data.flashcard_data)); 
          setIsModalOpen(true);
        } else {
          const errorData = await response.json();
          console.error("Error generating flashcards:", errorData);
        }
      } catch (error) {
        console.error("Error sending request:", error);
      }
    }
  };

  return (
    <>
      <div className="flash-footer">
        {/* Attachment Button */}
        <button 
          className="footer-btn attach-boton" 
          onClick={() => document.getElementById('attach-file').click()}
        >
          <AiOutlinePaperClip className="footer-icon" />
        </button>
        <input
          type="file"
          id="attach-file"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedFile(file);
              console.log("File attached:", file.name);
            }
          }}
        />

        {/* Input Field */}
        <input
          type="text"
          className="flash-footer-input"
          placeholder="Generate flashcards based on this file"
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