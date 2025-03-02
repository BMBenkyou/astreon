import React from "react";
import { useLocation } from "react-router-dom"; 
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import QuizBody from "../components/QuizBody"; 
import QuizFooter from "../components/QuizFooter";
import "./quiz.css";

const Quiz = () => {
  const location = useLocation();
  console.log("Current Path:", location.pathname); 

  return (
    <div className="MainContaineR">
      {/* Header */}
      <Header />

      <div className="nav-body">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <div className="main-content-wrapper">
            <div className="main-content">
                <QuizBody />  
            </div>

            {/* Footer content */}
            <div className="footer-content">
                <QuizFooter />
            </div>
        </div>
      </div>  
    </div>
  );
};

export default Quiz;

