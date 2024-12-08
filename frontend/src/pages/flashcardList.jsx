import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from "../components/headerLoggedin";
import "./flashcardList.css"; 

export function FlashcardList() {
    const [flashcardDetails, setFlashcardDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFlashcardDetails = async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            try {
                const response = await fetch(`http://localhost:8000/api/chat/flashcards/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Token ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch flashcard details");
                }
                const data = await response.json();
                const parsedQuestions = JSON.parse(data.questions);
                setFlashcardDetails({
                    title: data.title,
                    questions: parsedQuestions,
                });
            } catch (error) {
                setError(error.message || "An error occurred while fetching flashcard details");
            } finally {
                setLoading(false);
            }
        };

        fetchFlashcardDetails();
    }, [id]);

    const handleNextClick = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => Math.min(prev + 1, flashcardDetails.questions.length - 1));
    };

    const handlePreviousClick = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const handleCardFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div className="body">
            <Header />
            {loading ? (
                <p>Loading flashcards...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                flashcardDetails && flashcardDetails.questions && (
                    <div className="flashcard-container">
                        <h2>{flashcardDetails.title}</h2>
                        <div
                            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
                            onClick={handleCardFlip}
                        >
                            <div className="flashcard-front">
                                <h3>{flashcardDetails.questions[currentIndex].question}</h3>
                            </div>
                            <div className="flashcard-back">
                                <p>{flashcardDetails.questions[currentIndex].answer}</p>
                            </div>
                        </div>
                        <div className="navigation-buttons">
                            <button
                                className="nav-button"
                                onClick={handlePreviousClick}
                                disabled={currentIndex === 0}
                            >
                                Previous
                            </button>
                            <button
                                className="nav-button"
                                onClick={handleNextClick}
                                disabled={currentIndex === flashcardDetails.questions.length - 1}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
