import React from "react";
import "./FlashcardModel.css";

const FlashModal = ({ isOpen, onClose, promptText, onStartFlash }) => {
  return (
    <div className={`flash-modal-overlay ${isOpen ? "visible" : "hidden"}`}>
      <div className="flash-modal-content">
        <h2 className="modal-title">Flashcards has been successfully generated!</h2>

        <p className="modal-text">{promptText || "No prompt provided."}</p>

        <h2 className="modal-body">
          You can visit the sessions tab to review your generated flashcards
        </h2>

        <div className="btn-wrapper">
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
          <button className="StartFlash-btn" onClick={onStartFlash}>
            Start Flashcards
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashModal;
