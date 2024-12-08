import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export function SessionComponent({ session }) {
    const [questions, setQuestions] = useState([]);
    const [quizData, setQuizData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchQuizData = async (quizId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/chat/quizzes/${quizId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch quiz data");
            }
            const data = await response.json();
            setQuizData(data);
        } catch (error) {
            setError(error.message || "An error occurred while fetching the quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryClick = () => {
        if (session.category === "quiz") {
            fetchQuizData(session.quiz); // Access the quiz ID directly
        }
    };
    return (
        <div className="session-border">
            <div className="session-frame">
                <div className="session-design">
                    <div className="session-bottom-frame"></div>
                    <div onClick={handleCategoryClick} className="session-choice">
                        <span className="ai-study">{session.category}</span>
                    </div>
                    <span className="subject-session-title">{session.title}</span>
                    <div className="session-percentage">
                        <span className="percentage">{session.percentage}%</span> 
                    </div>
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
            {loading && <p>Loading questions...</p>}
            {error && <p>Error: {error}</p>}
            {questions.length > 0 && (
                <div>
                    <h2>Questions</h2>
                    {questions.map((question, index) => (
                        <div key={index}>
                            <p>{question.text}</p>
                            {question.answers.map((answer, i) => (
                                <button key={i}>{answer}</button>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
