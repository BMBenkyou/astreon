import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./session.css";
import "./sidebar.css";

export function Session() {
    const { state } = useLocation(); // Retrieve the state passed from Quiz.jsx
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    // Load saved sessions from localStorage on component mount
    useEffect(() => {
        const savedSessions = localStorage.getItem("sessions");
        if (savedSessions) {
            setSessions(JSON.parse(savedSessions));
        }
    }, []);

    useEffect(() => {
        if (state) {
            // If quiz data exists, update the session
            const { title, category } = state;
            const newSession = {
                id: Date.now(), // Create a unique ID based on the current timestamp
                title: title,
                subject: category,
                percentage: 0, // You can update this as per your requirement
            };

            // Update sessions state and localStorage
            const updatedSessions = [...sessions, newSession];
            setSessions(updatedSessions);
            localStorage.setItem("sessions", JSON.stringify(updatedSessions));
        }
    }, [state, sessions]);

    const handleSessionClick = (sessionTitle, sessionCategory) => {
        navigate(`/quiz?title=${sessionTitle}&category=${sessionCategory}`);
    };
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
                                                    <div className="huge-icons-bot">
                                                        <div className="group"></div>
                                                    </div>
                                                </div>
                                                <div className="depth-frame-1">
                                                    <span className="ai-study">Quiz</span>
                                                </div>
                                            </button>
                                            <Link to="/quizlist">
                                            <span className="subject-session-title">{session.title}</span>
                                            </Link>
                                            <button className="session-percentage">
                                                <div className="depth-frame-2">
                                                    <div className="depth-frame-3"></div>
                                                </div>
                                                <div className="depth-frame-4">
                                                    <span className="percentage">{session.percentage} %</span>
                                                </div>
                                            </button>
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
