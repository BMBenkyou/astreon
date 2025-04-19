import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import QuizModal from "./QuizModal";
import "./QuizFooter.css";

const QuizFooter = ({ title, description, selectedFile, setSelectedFile, onStartQuiz }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

const handleSend = async () => {
  if (prompt.trim() !== "") {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (selectedFile) {  // Only append if a file was selected
      formData.append("file", selectedFile);
    }
    formData.append("prompt", prompt);
    
    const token = localStorage.getItem('accessToken');  
    if (!token) {
      console.error("No access token found");
      return;
    }
   
    try {
      const response = await fetch("http://127.0.0.1:8000/api/quiz/generate/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });
      
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("currentQuiz", JSON.stringify(data.quiz_data)); 
        setIsModalOpen(true);
      } else {
        const errorData = await response.json();
        console.error("Error generating quiz:", errorData);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  }
};

  return (
    <>
      <div className="quiz-footer">
        {/* Attachment Button */}
        <button
          className="footer-btn attach-bton"
          onClick={() => document.getElementById("attach-file").click()}
        >
          <AiOutlinePaperClip className="footer-icon" />
        </button>
        <input
          type="file"
          id="attach-file"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setSelectedFile(file);
              console.log("File attached:", file.name);
            }
          }}
        />

        {/* Input Field for Prompt */}
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
          setIsModalOpen(false);
          onStartQuiz();
        }}
      />
    </>
  );
};

export default QuizFooter;
