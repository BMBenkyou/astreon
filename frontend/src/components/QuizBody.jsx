import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai"; // Import the icon
import "./QuizBody.css";

const QuizBody = () => {
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  return (
    <div className="quiz-container">
      <h2 className="Navquiz-title">Create Quiz</h2>

      <div className="quiz-input-wrapper">
        {/* Title Input with Icon */}
        <div className="quiz-input-group relative">
          <input
            type="text"
            className={`quiz-input pr-10 ${titleFocused ? "placeholder:font-normal" : "placeholder:font-bold"}`}
            placeholder="Title"
            onFocus={() => setTitleFocused(true)}
            onBlur={(e) => setTitleFocused(e.target.value.length > 0)}
          />
          <AiOutlineMessage className="quiz-icon" />
        </div>

        {/* Description Textarea */}
        <div className="quiz-textarea-group">
          <textarea
            className={`quiz-textarea ${descriptionFocused ? "placeholder:font-normal" : "placeholder:font-bold"}`}
            placeholder="Description"
            onFocus={() => setDescriptionFocused(true)}
            onBlur={(e) => setDescriptionFocused(e.target.value.length > 0)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default QuizBody;
