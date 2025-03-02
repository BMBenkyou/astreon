import React from "react";
import "./SaveButton.css";

const SaveButton = ({ onClick }) => {
  return (
    <button className="save-button noselect" onClick={onClick}>
      <span className="text">Save</span>
      <span className="icon">
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.707 19.121a.997.997 0 0 1-1.414 0l-5.646-5.647a1.5 1.5 0 0 1 0-2.121l.707-.707a1.5 1.5 0 0 1 2.121 0L9 14.171l9.525-9.525a1.5 1.5 0 0 1 2.121 0l.707.707a1.5 1.5 0 0 1 0 2.121z"></path>
        </svg>
      </span>
    </button>
  );
};

export default SaveButton;
