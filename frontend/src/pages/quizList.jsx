import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import "./sidebar.css";
import "./quizList.css"; 

export function QuizList() {
    const [quizDetails, setQuizDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const { id } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizDetails = async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            try {
                const response = await fetch(`http://localhost:8000/api/chat/quizzes/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch quiz details");
                }
                const data = await response.json();
                if (typeof data.questions === "string") {
                    data.questions = JSON.parse(data.questions);
                }
                setQuizDetails(data);
            } catch (error) {
                setError(error.message || "An error occurred while fetching quiz details");
            } finally {
                setLoading(false);
            }
        };

        fetchQuizDetails();
    }, [id]);

    const handleAnswerClick = (answerText) => {
        const currentQuestion = quizDetails.questions[currentQuestionIndex];
        const isCorrect = currentQuestion.answers.find((answer) => answer.text === answerText)?.correct;

        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: { text: answerText, correct: isCorrect },
        });

       
        if (currentQuestionIndex < quizDetails.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            alert("You've completed the quiz!");
            navigate("/quiz-summary", { state: { quizDetails, selectedAnswers } });
        }
    };

    if (loading) {
        return <p>Loading quiz...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!quizDetails) {
        return <p>No quiz data available</p>;
    }

    const currentQuestion = quizDetails.questions[currentQuestionIndex];

    return (
        <div className="body">
            <Header />
            <div className="quiz-container">
                <div className="quiz-header">
                    <h2>Quiz Details</h2>
                    <hr />
                </div>
                <div className="quiz-content">
                    <div className="quiz-card">
                        <div className="quiz-question">
                            <p>{currentQuestion.question}</p>
                        </div>
                        <div className="answer-options">
                            {currentQuestion.answers.map((answer, idx) => (
                                <button
                                    key={idx}
                                    className={`answer-button ${
                                        selectedAnswers[currentQuestionIndex]?.text === answer.text
                                            ? answer.correct
                                                ? "selected correct"
                                                : "selected incorrect"
                                            : ""
                                    }`}
                                    onClick={() => handleAnswerClick(answer.text)}
                                >
                                    {answer.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    );
}
