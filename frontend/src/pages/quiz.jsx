import React, { useState } from "react";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import QuizBody from "../components/QuizBody";
import QuizFooter from "../components/QuizFooter";
import QuizTest from "../components/QuizTest"; // New Quiz Test Component
import "./quiz.css";

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);

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
