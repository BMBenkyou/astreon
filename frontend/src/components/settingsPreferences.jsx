import React, { useState } from "react";
import "./settingsPreferences.css"; // Import styles

const SettingsPreferences = () => {
  // State for input values
  const [studyStyle, setStudyStyle] = useState("");
  const [favoriteSubject, setFavoriteSubject] = useState("");
  const [learningGoal, setLearningGoal] = useState("");

  return (
    <div className="preferences-container">
      <h2 className="preferences-title">Preferences</h2>

      <div className="Sinput-group">
        <label>Preferred study style</label>
        <input
          type="text"
          placeholder="Enter your study style (e.g., Visuals)"
          value={studyStyle}
          onChange={(e) => setStudyStyle(e.target.value)}
        />
      </div>

      <div className="Sinput-group">
        <label>Favorite subjects</label>
        <input
          type="text"
          placeholder="Enter your favorite subject (e.g., Math)"
          value={favoriteSubject}
          onChange={(e) => setFavoriteSubject(e.target.value)}
        />
      </div>

      <div className="Sinput-group">
        <label>Learning goal</label>
        <textarea
          rows="8"
          placeholder="Enter your learning goal"
          value={learningGoal}
          onChange={(e) => setLearningGoal(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
};

export default SettingsPreferences;
