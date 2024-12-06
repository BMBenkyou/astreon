import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./flashcardsList.css";
import "./sidebar.css";

const flashcardsData = [
    {
        question: "Which Git command is used to upload local commits to a remote repository?",
        answer: "git push"
    },
    {
        question: "What is polymorphism in object-oriented programming?",
        answer: "The ability of an object to take on many forms."
    },
    {
        question: "In a relational database, what is a 'row' typically referred to as?",
        answer: "A record"
    },
    {
        question: "What type of diagram visually represents the classes and their relationships in a software design?",
        answer: "Class diagram"
    },
    {
        question: "Which of the following is NOT a typical component of a comprehensive test plan?",
        answer: "Marketing budget"
    }
];

export function FlashcardsList() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    const handleNext = () => {
        if (currentIndex < flashcardsData.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setFlipped(false);
        }
    };

    const handleCardClick = () => {
        setFlipped(!flipped);
    };

    const isFirstCard = currentIndex === 0;
    const isLastCard = currentIndex === flashcardsData.length - 1;

    return (
        <div className="body">
            <Header />
            <div className="grid">
                <div className="sidebar">
                    <Link to="/chatbox" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/aichat.svg" alt="AI Study" />
                        AI Study
                    </Link>
                    <Link to="/quizme" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/quiz.svg" alt="Quiz Me" />
                        Quiz Me
                    </Link>
                    <Link to="/flashcards" className="sidebarbutton active">
                        <img className="sidebaricon" src="./imgs/svgs/cards.svg" alt="Flashcards" />
                        Flashcards
                    </Link>
                    <Link to="/sessions" className="sidebarbutton">
                        <img className="sidebaricon" src="./imgs/svgs/sessions.svg" alt="Sessions" />
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
                        <div className="page-title">Flashcards</div>
                        <hr />
                    </div>
                    <div className="flashcard-container">
                        <div
                            className={`flashcard ${flipped ? "flipped" : ""}`}
                            onClick={handleCardClick}
                        >
                            <div className="flashcard-front">
                                <p>{flashcardsData[currentIndex].question}</p>
                            </div>
                            <div className="flashcard-back">
                                <p>{flashcardsData[currentIndex].answer}</p>
                            </div>
                        </div>
                        <div className="navigation-buttons">
                            <button
                                className="nav-button"
                                type="button"
                                onClick={handlePrevious}
                                disabled={isFirstCard}
                            >
                                &lt; Previous
                            </button>
                            <button
                                className="nav-button"
                                type="button"
                                onClick={handleNext}
                                disabled={isLastCard}
                            >
                                Next &gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
