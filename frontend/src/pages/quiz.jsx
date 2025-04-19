import React, { useState } from "react";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import QuizBody from "../components/QuizBody";
import QuizFooter from "../components/QuizFooter";
import QuizTest from "../components/QuizTest";
import "./quiz.css";

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [title, setTitle] = useState(""); // 🟢 State for title
  const [description, setDescription] = useState(""); // 🟢 State for description
  const [selectedFile, setSelectedFile] = useState(null); // 🟢 State for file upload

  return (
    <div className="MainContaineR">
      <Header />
      <div className="nav-body">
        <Sidebar />

        {/* Main Content */}
        <div className="main-content-wrapperQZ">
          <div className="main-contentQZ">
            {quizStarted ? (
              <QuizTest onExit={() => setQuizStarted(false)} />
            ) : (
              <QuizBody setTitle={setTitle} setDescription={setDescription} />
            )}
          </div>

          {/* Footer (Hidden when quiz starts) */}
          {!quizStarted && (
            <div className="footer-content">
              <QuizFooter
                title={title}
                description={description}
                selectedFile={selectedFile}
                setSelectedFile={setSelectedFile}
                onStartQuiz={() => setQuizStarted(true)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
