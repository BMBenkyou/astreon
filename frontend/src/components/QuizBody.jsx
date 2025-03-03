import React from "react";
import { AiOutlineMessage } from "react-icons/ai"; // Import the icon
import "./QuizBody.css";

const QuizBody = ({ title, setTitle, body, setBody }) => {
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleBodyChange = (e) => {
    setBody(e.target.value);
  };

  return (
    <div className="quiz-container">
      <h2 className="Navquiz-title">Create Quiz</h2>

      <div className="quiz-input-wrapper">
        {/* Title Input with Icon */}
        <div className="quiz-input-group relative">
          <input
            type="text"
            className="quiz-input pr-10"
            placeholder="Quiz Title"
            value={title}
            onChange={handleTitleChange}
            required
          />
          <AiOutlineMessage className="quiz-icon" />
        </div>

        {/* Description Textarea */}
        <div className="quiz-textarea-group">
          <textarea
            className="quiz-textarea"
            placeholder="Quiz Description"
            value={body}
            onChange={handleBodyChange}
            required
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default QuizBody;
