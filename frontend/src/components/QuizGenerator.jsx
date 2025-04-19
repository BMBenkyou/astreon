import React, { useState } from "react";
import { AiOutlineMessage, AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import axios from "axios";
import "./QuizStyles.css";

const QuizGenerator = () => {
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  
  // UI state
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("Please provide a title for your quiz");
      return;
    }

    if (!prompt.trim() && !file) {
      setError("Please provide either a prompt or upload a file for quiz generation");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create form data
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("prompt", prompt);
      
      if (file) {
        formData.append("file", file);
      }

      // Send request to your backend
      const response = await axios.post("/api/generate-quiz/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle successful response
      setGeneratedQuiz(response.data.quiz_data);
      setIsModalOpen(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate quiz. Please try again.");
      setLoading(false);
    }
  };

  // Route to the session page (to be implemented)
  const navigateToSession = () => {
    // This would typically use react-router
    window.location.href = "/sessions";
  };

  // Start the generated quiz
  const startQuiz = () => {
    // Store quiz in localStorage so quiz test component can access it
    if (generatedQuiz) {
      localStorage.setItem("currentQuiz", JSON.stringify(generatedQuiz));
      window.location.href = "/take-quiz";
    }
  };

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      <h2 className="Navquiz-title">Create Quiz</h2>

      {/* Main Form */}
      <div className="quiz-input-wrapper">
        {/* Title Input */}
        <div className="quiz-input-group relative">
          <input
            type="text"
            className={`quiz-input pr-10 ${
              titleFocused ? "placeholder:font-normal" : "placeholder:font-bold"
            }`}
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setTitleFocused(true)}
            onBlur={(e) => setTitleFocused(e.target.value.length > 0)}
          />
          <AiOutlineMessage className="quiz-icon" />
        </div>

        {/* Description Textarea */}
        <div className="quiz-textarea-group">
          <textarea
            className={`quiz-textarea ${
              descriptionFocused ? "placeholder:font-normal" : "placeholder:font-bold"
            }`}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onFocus={() => setDescriptionFocused(true)}
            onBlur={(e) => setDescriptionFocused(e.target.value.length > 0)}
          />
        </div>

        {/* File Upload Indicator */}
        {fileName && (
          <div className="file-indicator">
            <AiOutlinePaperClip />
            <span>{fileName}</span>
            <button onClick={() => {
              setFile(null);
              setFileName("");
            }}>✕</button>
          </div>
        )}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Footer */}
      <div className="quiz-footer">
        {/* Attachment Button */}
        <button 
          className="footer-btn attach-btn" 
          onClick={() => document.getElementById('attach-file').click()}
        >
          <AiOutlinePaperClip className="footer-icon" />
        </button>
        <input
          type="file"
          id="attach-file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
          accept=".txt,.pdf,.docx,.doc,.md"
        />

        {/* Prompt Input Field */}
        <input
          type="text"
          className="quiz-footer-input"
          placeholder={file 
            ? "Add additional instructions for quiz generation" 
            : "Generate a quiz about..."}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Send Button */}
        <button 
          className={`send-btn ${loading ? 'loading' : ''}`} 
          onClick={handleSubmit}
          disabled={loading}
        >
          <div className="svg-wrapper">
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <AiOutlineSend className="footer-icon send-icon" />
            )}
          </div>
          <span>{loading ? "Generating..." : "Send"}</span>
        </button>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="quiz-modal-overlay visible">
          <div className="quiz-modal-content">
            <h2 className="modal-title">Quiz has been successfully generated!</h2>
            <p className="modal-text">
              {title} - {generatedQuiz?.questions?.length || 0} questions
            </p>
            <h2 className="modal-body">
              You can visit the sessions tab to review your generated quiz
            </h2>
            <div className="btn-wrapper">
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
              <button className="StartQuiz-btn" onClick={startQuiz}>
                Start Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;