import React, { useState } from "react";
import { AiOutlineMessage } from "react-icons/ai"; // Import the icon
import "./FlashBody.css";

const FlashBody = () => {
  const [titleFocused, setTitleFocused] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  return (
    <div className="flash-container">
      <h2 className="Navflash-title">Create Flashcards</h2>

      <div className="flash-input-wrapper">
        {/* Title Input with Icon */}
        <div className="flash-input-group relative">
          <input
            type="text"
            className={`flash-input pr-10 ${
              titleFocused ? "placeholder:font-normal" : "placeholder:font-bold"
            }`}
            placeholder="Title"
            onFocus={() => setTitleFocused(true)}
            onBlur={(e) => setTitleFocused(e.target.value.length > 0)}
          />
          <AiOutlineMessage className="flash-icon" />
        </div>

        {/* Description Textarea */}
        <div className="flash-textarea-group">
          <textarea
            className={`flash-textarea ${
              descriptionFocused ? "placeholder:font-normal" : "placeholder:font-bold"
            }`}
            placeholder="Description"
            onFocus={() => setDescriptionFocused(true)}
            onBlur={(e) => setDescriptionFocused(e.target.value.length > 0)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default FlashBody;
