import React, { useState } from "react";
import AttachButton from "../components/AttachButton";
import ProceedButton from "../components/ProceedButton";
import RedoButton from "../components/RedoButton";
import ScheduleCreated from "../components/ScheduleCreated";
import "./FilePreview.css";

const FilePreview = () => {
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScheduleCreated, setIsScheduleCreated] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
    }
  };

  const handleProceed = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsScheduleCreated(true);
    }, 3000); // Simulate processing for 3 seconds
  };

  return (
    <div className="preview-container">
      <h2 className="preview-title">Generate Schedule</h2>

      {/* Show preview-box only if ScheduleCreated is NOT shown */}
      {!isScheduleCreated && (
        <div className="preview-box">
          {preview ? (
            <img src={preview} alt="Uploaded Preview" className="preview-image" />
          ) : (
            <p className="preview-placeholder">
              Please make sure:<br />
              <br />
              1. The photo is clear<br />
              <br />
              2. The calendar you upload<br />
              has bold block colors<br />
              along with their time
            </p>
          )}
        </div>
      )}

      {/* Hide Attach Button when Schedule is created */}
      {!isScheduleCreated && (
        <div className="Oattach-button-container">
          <AttachButton type="file" accept="image/*" onChange={handleFileChange} />
        </div>
      )}

      <div className="button-box">
        {/* Hide Redo and Proceed buttons after schedule is created */}
        {!isScheduleCreated && <RedoButton onClick={() => setPreview(null)} />}
        {!isScheduleCreated && <ProceedButton onClick={handleProceed} />}
      </div>

      {/* Modal for loading animation */}
      {isProcessing && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p className="loading-text">Processing...</p>
            <div className="loading-spinner"></div>
          </div>
        </div>
      )}

      {/* Show ScheduleCreated after processing is done */}
      {isScheduleCreated && (
        <div className="schedule-wrapper">
          <ScheduleCreated />
        </div>
      )}
    </div>
  );
};

export default FilePreview;
