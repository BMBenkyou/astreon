import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./profile.css";
import "./sidebar.css";

export function Profile() {
        
    return (
        <div className="body">
        <Header />
        <div className="grid">
            <div className="sidebar">
                <Link to="/chatbox" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/aichat.svg"
                        alt="AI Study"
                    />
                    AI Study
                </Link>
                <Link to="/quizme" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/quiz.svg"
                        alt="Quiz Me"
                    />
                    Quiz Me
                </Link>
                <Link to="/flashcards" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/cards.svg"
                        alt="Flashcards"
                    />
                    Flashcards
                </Link>
                <Link to="/sessions" className="sidebarbutton">
                    <img
                        className="sidebaricon"
                        src="./imgs/svgs/sessions.svg"
                        alt="Sessions"
                    />
                    Sessions
                </Link>

                <div className="helpbuttonsdiv">
                    <a className="helplink" href="#">
                        <img
                            className="helpbuttons"
                            src="./imgs/svgs/help.svg"
                            alt="Help"
                        />
                        <p className="phelpbuttons">Help</p>
                    </a>
                </div>
                <div className="helpbuttonsdiv">
                    <a className="helplink" href="#">
                        <img
                            className="helpbuttons"
                            src="./imgs/svgs/feedback.svg"
                            alt="Feedback"
                        />
                        <p className="phelpbuttons">Feedback</p>
                    </a>
                </div>
            </div>

            <div className="main-page-div">
                <div className="main-age-title-div">
                    <div className="page-title">Daily Progression</div>
                    <hr />
                </div>
                <div className="main-div-01">
                    
                </div>
                <div className="main-div-02">

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
