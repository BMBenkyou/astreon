import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import QuizModal from "./QuizModal";
import "./QuizFooter.css";

const QuizFooter = ({ title, description, onStartQuiz }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAcceptedTypes, setShowAcceptedTypes] = useState(false);
  const [fileError, setFileError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const acceptedTypes = [
    "application/pdf",
    "text/plain",
    "text/html",
    "image/png",
    "image/jpeg",
    "image/jpg",
  ];

  const handleSend = async () => {
    if (prompt.trim() !== "" || selectedFile) {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", title || "Quiz Set");
      formData.append("description", description || "");
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("prompt", prompt);

      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No access token found");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8080/api/quiz/generate/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("currentQuiz", JSON.stringify(data.quiz_data));
          setIsLoading(false);
          setIsModalOpen(true);
        } else {
          const errorData = await response.json();
          console.error("Error generating quiz:", errorData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error sending request:", error);
        setIsLoading(false);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!acceptedTypes.includes(file.type)) {
        setFileError("Unsupported file type. Accepted types: PDF, TXT, JPG, PNG, HTML.");
        setUploadedFileName("");
        setSelectedFile(null);
      } else {
        setFileError("");
        setUploadedFileName(file.name);
        setSelectedFile(file);
        console.log("File attached:", file.name);
      }
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadedFileName("");
    setFileError("");
  };

  return (
    <div className="quiz-footer-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}

      <div className="file-info">
        {showAcceptedTypes && (
          <p><strong>Accepted file types:</strong> PDF, TXT, JPG, PNG, HTML</p>
        )}
        {fileError && <p className="file-error">{fileError}</p>}
      </div>

      {uploadedFileName && (
        <div className="uploaded-file-info">
          <p>
            <strong>Uploaded File:</strong> {uploadedFileName}
            <button
              onClick={handleRemoveFile}
              className="remove-file-btn"
              title="Remove file"
              style={{
                marginLeft: "10px",
                background: "none",
                border: "none",
                color: "#c00",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </p>
        </div>
      )}

      <div className="quiz-footer">
        <button
          className="footer-btn attach-boton"
          onClick={() => {
            setShowAcceptedTypes(true);
            document.getElementById("attach-file").click();
          }}
        >
          <AiOutlinePaperClip className="footer-icon" />
        </button>

        <input
          type="file"
          id="attach-file"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <input
          type="text"
          className="quiz-footer-input"
          placeholder="Generate quiz based on this file"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button className="send-btn" onClick={handleSend}>
          <div className="svg-wrapper">
            <AiOutlineSend className="footer-icon send-icon" />
          </div>
          <span></span>
        </button>
      </div>

      <QuizModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptText={prompt}
        onStartQuiz={() => {
          setIsModalOpen(false);
          onStartQuiz();
        }}
      />
    </div>
  );
};

export default QuizFooter;
