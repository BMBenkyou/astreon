import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import "./sessions.css";

// Arrow icon for navigation
const ArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
    <path d="M9 18L15 12L9 6" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Enhanced SessionCard component with score display
const SessionCard = ({ item, type, onClick }) => {
  // Format the date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`sessions-div ${type}-card`} onClick={onClick}>
      <div className="session-header">
        <h3 className="session-title">{item.title}</h3>
        <ArrowIcon />
      </div>
      
      {/* Description with "No description available" if none */}
      <p className="session-description-text">{item.description || "No description available"}</p>
      
      <div className="session-meta">
        <span className="session-count">
          {type === 'quiz' 
            ? `${item.question_count} questions` 
            : `${item.card_count} cards`}
        </span>
        <span className="session-date">Created {formatDate(item.created_at)}</span>
      </div>
      
      {/* Display score if available (for quizzes only) */}
      {type === 'quiz' && item.latest_score !== undefined && (
        <div className="session-score">
          <span className="score-label">Latest Score:</span>
          <span className="score-value">{item.latest_score}%</span>
        </div>
      )}
    </div>
  );
};

export default function Sessions() {
  const [quizzes, setQuizzes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);
  const navigate = useNavigate();

  // Fetch quizzes with latest scores
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoadingQuizzes(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        setLoadingQuizzes(false);
        return;
      }
      
      try {
        const response = await fetch("http://127.0.0.1:8080/api/quizzes/", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Now fetch latest scores for each quiz
          const quizzesWithScores = await Promise.all(data.quizzes.map(async (quiz) => {
            try {
              const scoreResponse = await fetch(`http://127.0.0.1:8080/api/quizzes/${quiz.id}/latest-score`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });
              
              const scoreData = await scoreResponse.json();
              
              if (scoreData.success && scoreData.score !== undefined) {
                return { ...quiz, latest_score: scoreData.score };
              }
              
              return quiz;
            } catch (error) {
              console.error(`Error fetching score for quiz ${quiz.id}:`, error);
              return quiz;
            }
          }));
          
          setQuizzes(quizzesWithScores);
        } else {
          console.error("Failed to fetch quizzes:", data);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoadingQuizzes(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Fetch flashcards
  useEffect(() => {
    const fetchFlashcards = async () => {
      setLoadingFlashcards(true);
      
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        setLoadingFlashcards(false);
        return;
      }
      
      try {
        const response = await fetch("http://127.0.0.1:8080/api/flashcard/sets/", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const data = await response.json();
        
        if (data.success) {
          setFlashcards(data.flashcard_sets);
        } else {
          console.error("Failed to fetch flashcards:", data);
        }
      } catch (error) {
        console.error("Error fetching flashcards:", error);
      } finally {
        setLoadingFlashcards(false);
      }
    };

    fetchFlashcards();
  }, []);

  const handleQuizClick = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  const handleFlashcardClick = (flashcardSetId) => {
    navigate(`/flashcards/${flashcardSetId}`);
  };

  // Loading component for better UX
  const LoadingState = () => (
    <div className="flex justify-center items-center h-40">
      <div className="loading-spinner"></div>
      <p className="ml-3">Loading...</p>
    </div>
  );

  // Empty state component
  const EmptyState = ({ type }) => (
    <div className="empty-state">
      <p>No {type} found. Create {type === 'quizzes' ? 'a quiz' : 'flashcards'} to get started!</p>
    </div>
  );

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        <div className="grid-container-sidebar">
          <div className="sidebar-sessions">
            <Sidebar />
          </div>
          <div className="main-sessions-grid">
            {/* Quizzes Section */}
            <div className="session-category">
              <div className="category-header">
                <h2 className="category-title">Quizzes</h2>
                <button 
                  className="create-btn"
                  onClick={() => navigate('/quiz')}
                >
                  Create New Quiz
                </button>
              </div>
              
              {loadingQuizzes ? (
                <LoadingState />
              ) : quizzes.length > 0 ? (
                <div className="sessions-grid">
                  {quizzes.map((quiz) => (
                    <SessionCard 
                      key={quiz.id} 
                      item={quiz}
                      type="quiz" 
                      onClick={() => handleQuizClick(quiz.id)} 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="quizzes" />
              )}
            </div>
            
            {/* Flashcards Section */}
            <div className="session-category">
              <div className="category-header">
                <h2 className="category-title">Flashcards</h2>
                <button className="create-btn"
                  onClick={() => navigate('/flashcards')}
                >
                  Create New Flashcards
                </button>
              </div>
              
              {loadingFlashcards ? (
                <LoadingState />
              ) : flashcards.length > 0 ? (
                <div className="sessions-grid">
                  {flashcards.map((flashcardSet) => (
                    <SessionCard 
                      key={flashcardSet.id} 
                      item={flashcardSet}
                      type="flashcard" 
                      onClick={() => handleFlashcardClick(flashcardSet.id)} 
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="flashcards" />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}