import React, { useState, useRef } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import FlashModal from "./FlashcardModel";
import "./FlashFooter.css";

const FlashFooter = ({ title, description, onStartFlash }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAcceptedTypes, setShowAcceptedTypes] = useState(false);
  const [fileError, setFileError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);

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
      formData.append("title", title || "Flashcard Set");
      formData.append("description", description || "");
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("prompt", prompt);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        setIsLoading(false);
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
          setIsLoading(false);
          setIsModalOpen(true);
        } else {
          const errorData = await response.json();
          console.error("Error generating flashcards:", errorData);
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
    // Reset the file input to allow re-selection of the same file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flash-footer-container">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>
      )}

      {/* File Information */}
      <div className="file-info">
        {showAcceptedTypes && (
          <p><strong>Accepted file types:</strong> PDF, TXT, JPG, PNG, HTML</p>
        )}
        {fileError && <p className="file-error">{fileError}</p>}
        {uploadedFileName && (
          <p><strong>Uploaded File:</strong> {uploadedFileName}</p>
        )}
      </div>

      <div className="flash-footer">
        {/* Attachment Button */}
        <button
          className="footer-btn attach-boton"
          onClick={() => {
            setShowAcceptedTypes(true);
            if (fileInputRef.current) {
              fileInputRef.current.click();
            }
          }}
        >
          <AiOutlinePaperClip className="footer-icon" />
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          id="attach-file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          ref={fileInputRef}
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
          <span></span>
        </button>
      </div>

      {/* Modal Component */}
      <FlashModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promptText={prompt}
        onStartFlash={() => {
          setIsModalOpen(false);
          onStartFlash();
        }}
      />
    </div>
  );
};

export default FlashFooter;
