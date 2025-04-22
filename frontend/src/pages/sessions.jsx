import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderLoggedIn";
import Sidebar from "../components/NSidebar";
import "./sessions.css";

const sessionicon = "/session-icon.svg";
const flashcardIcon = "/flashcard-icon.svg"; // Add this icon to your project

// Card component that can be used for both quizzes and flashcards
const SessionCard = ({ item, type, onClick }) => (
  <div className={`sessions-div ${type}-card`} onClick={onClick}>
    <div className="session-header">
      <p className="session-title">{item.title}</p>
      <img 
        src={type === 'quiz' ? sessionicon : flashcardIcon} 
        alt={`${type}-icon`} 
        className="session-icon" 
      />
    </div>
    <p className="session-description">
      {type === 'quiz' 
        ? `${item.question_count} questions` 
        : `${item.card_count} cards`} 
      • Created on {new Date(item.created_at).toLocaleDateString()}
    </p>
  </div>
);

export default function Sessions() {
  const [quizzes, setQuizzes] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [loadingFlashcards, setLoadingFlashcards] = useState(true);
  const navigate = useNavigate();

  // Fetch quizzes
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
          setQuizzes(data.quizzes);
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
              <h2 className="category-title">Quizzes</h2>
              
              {loadingQuizzes ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading quizzes...</p>
                </div>
              ) : quizzes.length > 0 ? (
                <div className="sessions-container-quizzes">
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
                <div className="empty-state">
                  <p>No quizzes found. Create a quiz to get started!</p>
                </div>
              )}
            </div>
            
            {/* Flashcards Section */}
            <div className="session-category">
              <h2 className="category-title">Flashcards</h2>
              
              {loadingFlashcards ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading flashcards...</p>
                </div>
              ) : flashcards.length > 0 ? (
                <div className="sessions-container-flashcards">
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
                <div className="empty-state">
                  <p>No flashcard sets found. Create flashcards to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}