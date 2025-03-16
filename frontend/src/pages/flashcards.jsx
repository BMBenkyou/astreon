import React, { useState } from "react";
import Header from "../components/NHeader"; // Header component
import Sidebar from "../components/NSidebar"; // Sidebar component
import FlashBody from "../components/FlashBody"; // Flashcards body component
import FlashFooter from "../components/FlashFooter"; // Flashcards footer component
import FlashTest from "../components/FlashTest"; // New Flashcards Test Component
import "./flashcards.css"; // Importing CSS for styling

const Flash = () => {
  const [flashStarted, setFlashStarted] = useState(false); // State to track if flashcards has started

  return (
    <div className="MainContaineR">
      {/* Header */}
      <Header />

      <div className="nav-body">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content-wrapperFC">
          <div className="main-contentFC">
            {flashStarted ? <FlashTest onExit={() => setFlashStarted(false)} /> : <FlashBody />}
          </div>

          {/* Footer (Hidden when flashcards starts) */}
          {!flashStarted && (
            <div className="footer-content">
              <FlashFooter onStartFlash={() => setFlashStarted(true)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flash;

