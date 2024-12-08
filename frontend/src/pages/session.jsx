import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./session.css";
import "./sidebar.css";

export function Session() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            try {
                const response = await fetch("http://localhost:8000/api/chat/session/", {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch sessions");
                }
                const data = await response.json();
                setSessions(data);
            } catch (error) {
                setError(error.message || "An error occurred while fetching sessions");
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const handleCardClick = (category, id) => {
        if (category === 'quiz') {
            navigate(`/quiz-detail/${id}`); // Redirect to the quiz detail page with the session ID
        } else if (category === 'flashcard') {
            navigate(`/flashcard-detail/${id}`); // Redirect to the flashcard detail page with the session ID
        }
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
                        {loading ? (
                            <p>Loading sessions...</p>
                        ) : error ? (
                            <p>Error: {error}</p>
                        ) : (
                            <div className="grid-session">
                                {sessions.map((session) => {
                                
                                    let idToUse = session.quiz;
                                
                                    if (session.category === 'flashcard') {
                                        idToUse = session.flashcards; // Use flashcard ID if the category is flashcard
                                    } else {
                                        idToUse = session.quiz; // Use quiz ID otherwise
                                    }

                                    return (
                                        <div key={session.id} className="session-border">
                                            <div className="session-frame">
                                                <div className="session-design">
                                                    <div className="session-bottom-frame"></div>
                                                    <button
                                                        className="session-choice"
                                                        /* The quiz id that is declared at the top is for the quiz id stated in the session not the session id */
                                                        onClick={() => handleCardClick(session.category, idToUse)} // Use quizId here
                                                    >
                                                        <div className="depth-frame">
                                                            <div className="huge-icons-bot">
                                                                <div className="group"></div>
                                                            </div>
                                                        </div>
                                                        <div className="depth-frame-1">
                                                            <span className="ai-study">{session.category}</span>
                                                        </div>
                                                    </button>
                                                    <span className="subject-session-title">{session.title}</span>
                                                    <button className="session-percentage">
                                                        <div className="depth-frame-2">
                                                            <div className="depth-frame-3"></div>
                                                        </div>
                                                        <div className="depth-frame-4">
                                                            <span className="percentage">{session.percentage}%</span>
                                                        </div>
                                                    </button>
                                                    <div className="session-options">
                                                        <div className="charm-menu-kebab"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
