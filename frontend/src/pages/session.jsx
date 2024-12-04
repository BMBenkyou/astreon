import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./session.css";
import "./sidebar.css";

export function Session() {
    const [sessions, setSessions] = useState([
        {
            id: 1,
            title: "AI Study",
            subject: "Math In the Modern World",
            percentage: 20
        },
        {
            id: 2,
            title: "Quiz Me",
            subject: "English Communication",
            percentage: 20
        },
        {
            id: 3,
            title: "Flashcards",
            subject: "Economical Transitions",
            percentage: 20
        },
        {
            id: 4,
            title: "Learning Modes",
            subject: "Dimensions of The Cybersecurity Cube",
            percentage: 20
        },
    ]);

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


                <div className="chat-box">
                    <div className="chat-bot-title">
                        <div className="page-title">Session</div>
                        <hr />
                    </div>

                    <div className="session-main-div">
                        <div className="grid-session">
                            {sessions.map((session) => (
                                <div key={session.id} className="session-border">
                                    <div className="session-frame">
                                        <div className="session-design">
                                            <div className="session-bottom-frame"></div>
                                            <button className="session-choice">
                                                <div className="depth-frame">
                                                    <div className="huge-icons-bot"><div className="group"></div></div>
                                                </div>
                                                <div className="depth-frame-1">
                                                    <span className="ai-study">{session.title}</span>
                                                </div>
                                            </button>
                                            <span className="subject-session-title">{session.subject}</span>
                                            <button className="session-percentage">
                                                <div className="depth-frame-2"><div className="depth-frame-3"></div></div>
                                                <div className="depth-frame-4"><span className="percentage">{session.percentage} %</span></div>
                                            </button>
                                            <div className="session-options">
                                                <div className="charm-menu-kebab">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}