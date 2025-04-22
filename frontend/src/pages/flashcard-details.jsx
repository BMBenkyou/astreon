import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/HeaderLoggedIn";
import "./flashcard-detail.css";

export default function FlashcardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flashcardSet, setFlashcardSet] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlashcardSet = async () => {
      setLoading(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/flashcards/${id}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch flashcard set");
        }
        
        const data = await response.json();
        
        if (data.success) {
          setFlashcardSet(data);
        } else {
          setError(data.error || "Failed to fetch flashcard set");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcardSet();
  }, [id]);

  const handleNext = () => {
    if (!flashcardSet || !flashcardSet.cards) return;
    
    if (currentCardIndex < flashcardSet.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
    }
  };

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleBack = () => {
    navigate('/sessions');
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flashcard-container">
          <div className="loading">Loading flashcards...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="flashcard-container">
          <div className="error">Error: {error}</div>
          <button className="back-button" onClick={handleBack}>Back to Sessions</button>
        </div>
      </>
    );
  }

  if (!flashcardSet || !flashcardSet.cards || flashcardSet.cards.length === 0) {
    return (
      <>
        <Header />
        <div className="flashcard-container">
          <div className="error">No flashcards found</div>
          <button className="back-button" onClick={handleBack}>Back to Sessions</button>
        </div>
      </>
    );
  }

  const currentCard = flashcardSet.cards[currentCardIndex];
  const progress = `${currentCardIndex + 1} / ${flashcardSet.cards.length}`;

  return (
    <>
      <Header />
      
      <div className="flashcard-container">
        <div className="flashcard-header">
          <button className="back-button" onClick={handleBack}>
            &larr; Back
          </button>
          <h1 className="flashcard-title">{flashcardSet.title}</h1>
          <div className="progress-counter">{progress}</div>
        </div>

        <div 
          className={`flashcard ${flipped ? 'flipped' : ''}`} 
          onClick={handleFlip}
        >
          <div className="flashcard-inner">
            <div className="flashcard-front">
              <p>{currentCard.front}</p>
            </div>
            <div className="flashcard-back">
              <p>{currentCard.back}</p>
            </div>
          </div>
        </div>

        <div className="flashcard-controls">
          <button 
            className="control-button"
            onClick={handlePrevious}
            disabled={currentCardIndex === 0}
          >
            Previous
          </button>
          
          <button 
            className="flip-button"
            onClick={handleFlip}
          >
            Flip
          </button>
          
          <button 
            className="control-button"
            onClick={handleNext}
            disabled={currentCardIndex === flashcardSet.cards.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}