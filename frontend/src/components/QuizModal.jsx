import React from "react";
import "./QuizModal.css";

const QuizModal = ({ isOpen, onClose, promptText, onStartQuiz }) => {
  return (
    <div className={`quiz-modal-overlay ${isOpen ? "visible" : "hidden"}`}>
      <div className="quiz-modal-content">
        <h2 className="modal-title">Quiz has been successfully generated!</h2>

        <p className="modal-text">{promptText || "No prompt provided."}</p>

        <h2 className="modal-body">
          You can visit the sessions tab to review your generated quiz
        </h2>

        <div className="btn-wrapper">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          <button className="StartQuiz-btn" onClick={onStartQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
