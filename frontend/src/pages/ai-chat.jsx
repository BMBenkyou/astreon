import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/HeaderLoggedIn";
import Sidebar from "../components/NSidebar";
import "./sessions.css";

const sessionicon = "/session-icon.svg";

const SessionCard = ({ quiz, onClick }) => (
  <div className="sessions-div" onClick={onClick}>
    <div className="session-header">
      <p className="session-title">{quiz.title}</p>
      <img src={sessionicon} alt="session-icon" className="session-icon" />
    </div>
    <p className="session-description">
      {quiz.question_count} questions
    </p>
  </div>
);

export default function Sessions() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error("No access token found");
        setLoading(false);
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
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleQuizClick = (quizId) => {
    // Navigate to the quiz page when a card is clicked
    navigate(`/quiz/${quizId}`);
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
            <p className="text-xl font-semibold mb-4">Quizzes</p>
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>Loading quizzes...</p>
              </div>
            ) : quizzes.length > 0 ? (
              <div className="sessions-container-quizzes">
                {quizzes.map((quiz) => (
                  <SessionCard 
                    key={quiz.id} 
                    quiz={quiz} 
                    onClick={() => handleQuizClick(quiz.id)} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-40">
                <p>No quizzes found. Create a quiz to get started!</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}