import React from "react";
import "./QuizModal.css";

const QuizModal = ({ isOpen, onClose, promptText, quizData, onStartQuiz }) => {
  return (
    <div className={`quiz-modal-overlay ${isOpen ? "visible" : "hidden"}`}>
      <div className="quiz-modal-content">
        <h2 className="modal-title">Quiz has been successfully generated!</h2>

        <div className="quiz-details">
          <p className="modal-text">{promptText || "No prompt provided."}</p>
          
          {quizData && (
            <div className="quiz-preview">
              <h3 className="preview-title">Preview:</h3>
              <p className="question-count">
                {quizData.questions ? `${quizData.questions.length} questions generated` : 'No questions generated'}
              </p>
              
              {quizData.questions && quizData.questions.length > 0 && (
                <div className="sample-question">
                  <p className="sample-label">Sample Question:</p>
                  <p className="question-text">{quizData.questions[0].question}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="btn-wrapper">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          <button 
            className="StartQuiz-btn" 
            onClick={onStartQuiz}
            disabled={!quizData || !quizData.questions}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
