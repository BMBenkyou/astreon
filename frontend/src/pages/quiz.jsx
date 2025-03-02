import React, { useState } from "react";
import Header from "../components/NHeader"; // Header component
import Sidebar from "../components/NSidebar"; // Sidebar component
import QuizBody from "../components/QuizBody"; // Quiz body component
import QuizFooter from "../components/QuizFooter"; // Quiz footer component
import QuizTest from "../components/QuizTest"; // New Quiz Test Component
import "./quiz.css"; // Importing CSS for styling

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false); // State to track if quiz has started

  return (
    <div className="MainContaineR">
      {/* Header */}
      <Header />

      <div className="nav-body">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="main-content-wrapper">
          <div className="main-content">
            {quizStarted ? <QuizTest onExit={() => setQuizStarted(false)} /> : <QuizBody />}
          </div>

          {/* Footer (Hidden when quiz starts) */}
          {!quizStarted && (
            <div className="footer-content">
              <QuizFooter onStartQuiz={() => setQuizStarted(true)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

