import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/NHeader";
import Sidebar from "../components/NSidebar";
import "./takequiz.css";

export default function QuizTaking() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch quiz data when component mounts
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/quizzes/${quizId}/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Use the entire data object as the quiz since the quiz properties are at the root level
          setQuiz(data);
        } else {
          setError(data.error || "Failed to fetch quiz");
        }
      } catch (error) {
        setError(`Error fetching quiz: ${error.message}`);
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer
    });
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Move to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate and display results
  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setShowResults(true);
  };

  // Back to sessions
  const handleBackToSessions = () => {
    navigate('/sessions');
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  // Render loading state
  if (loading) {
    return (
      <>
        <Header />
        <main className="grid-container-sidebar">
          <div className="sidebar-quiz">
            <Sidebar />
          </div>
          <div className="quiz-container">
            <div className="loading-container">
              <p>Loading quiz...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <Header />
        <main className="grid-container-sidebar">
          <div className="sidebar-quiz">
            <Sidebar />
          </div>
          <div className="quiz-container">
            <div className="error-container">
              <h2>Error</h2>
              <p>{error}</p>
              <button 
                className="back-button"
                onClick={handleBackToSessions}
              >
                Back to Sessions
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Render if quiz not found
  if (!quiz) {
    return (
      <>
        <Header />
        <main className="grid-container-sidebar">
          <div className="sidebar-quiz">
            <Sidebar />
          </div>
          <div className="quiz-container">
            <div className="error-container">
              <h2>Quiz Not Found</h2>
              <p>The requested quiz could not be found.</p>
              <button 
                className="back-button"
                onClick={handleBackToSessions}
              >
                Back to Sessions
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Get current question
  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <>
      <Header />
      <main className="grid-container-sidebar">
        <div className="sidebar-quiz">
          <Sidebar />
        </div>
        <div className="quiz-container">
          {showResults ? (
            <div className="results-container">
              <h2>Quiz Results</h2>
              <h3>{quiz.title}</h3>
              <div className="score-display">
                <p>Your Score: {score} out of {quiz.questions.length}</p>
                <p>Percentage: {Math.round((score / quiz.questions.length) * 100)}%</p>
              </div>
              
              <div className="results-summary">
                <h4>Question Summary:</h4>
                {quiz.questions.map((question, index) => (
                  <div 
                    key={index} 
                    className={`question-result ${selectedAnswers[index] === question.correct_answer ? 'correct' : 'incorrect'}`}
                  >
                    <p><strong>Question {index + 1}:</strong> {question.question_text}</p>
                    <p>Your answer: {selectedAnswers[index] ? question.options[selectedAnswers[index]] : 'Not answered'}</p>
                    <p>Correct answer: {question.options[question.correct_answer]}</p>
                    {question.explanation && <p><strong>Explanation:</strong> {question.explanation}</p>}
                  </div>
                ))}
              </div>
              
              <div className="action-buttons">
                <button 
                  className="back-button"
                  onClick={handleBackToSessions}
                >
                  Back to Sessions
                </button>
                <button 
                  className="restart-button"
                  onClick={handleRestartQuiz}
                >
                  Restart Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="question-container">
              <div className="quiz-header">
                <h2>{quiz.title}</h2>
                <p className="question-counter">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
              </div>
              
              <div className="question-content">
                <h3>{currentQuestion.question_text}</h3>
                <div className="options-container">
                  {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <div 
                      key={key}
                      className={`option ${selectedAnswers[currentQuestionIndex] === key ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, key)}
                    >
                      <span className="option-key">{key.toUpperCase()}</span>
                      <span className="option-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="navigation-buttons">
                <button 
                  className="prev-button"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  Previous
                </button>
                
                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button 
                    className="next-button"
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestionIndex]}
                  >
                    Next
                  </button>
                ) : (
                  <button 
                    className="submit-button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < quiz.questions.length}
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}