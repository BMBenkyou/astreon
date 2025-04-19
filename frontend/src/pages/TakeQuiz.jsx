import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/HeaderLoggedIn";
import styles from "./TakeQuiz.module.css";

export default function TakeQuiz() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Main state variables
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Answer type state variables
  const [selectedOption, setSelectedOption] = useState(null);
  const [textAnswer, setTextAnswer] = useState("");
  
  // Quiz type selection
  const [selectedQuizType, setSelectedQuizType] = useState("multiple_choice");
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  
  // Answer feedback state
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [scoreCount, setScoreCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  
  // Reset any global styles that might be affecting this component
  useEffect(() => {
    // Create a style element
    const styleElement = document.createElement('style');
    
    // Add CSS to override any global styles
    styleElement.innerHTML = `
      .quiz-page-container * {
        box-sizing: border-box;
      }
      
      .quiz-page-container {
        width: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
      }
      
      .quiz-container-wide {
        width: 100%;
        max-width: 1200px !important;
        margin: 20px auto !important;
      }
    `;
    
    // Append to head
    document.head.appendChild(styleElement);
    
    // Clean up function
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  
  useEffect(() => {
    // Get quiz ID from URL or localStorage
    const quizIdFromURL = searchParams.get("id");
    const quizIdFromStorage = localStorage.getItem("currentQuizId");
    const quizId = quizIdFromURL || quizIdFromStorage;
    
    if (!quizId) {
      setError("No quiz ID found. Please select a quiz from the quiz list.");
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to take a quiz");
      setLoading(false);
      return;
    }
    
    // Fetch quiz details and questions
    const fetchQuizData = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await fetch(`http://127.0.0.1:8080/api/quiz/questions/${quizId}/`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!quizResponse.ok) throw new Error("Failed to load quiz details");
        const quizData = await quizResponse.json();
        setQuiz(quizData.quiz || quizData);
        
        // Fetch questions
        const questionsResponse = await fetch(`http://127.0.0.1:8080/api/quiz/questions/${quizId}`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!questionsResponse.ok) throw new Error("Failed to load quiz questions");
        const questionsData = await questionsResponse.json();
        
        // Process questions
        const questionsArray = Array.isArray(questionsData) ? questionsData : [];
        const processedQuestions = questionsArray.map(q => ({
          ...q,
          options: q.options || { "a": "Yes", "b": "No", "c": "I will try" }
        }));
        
        setQuestions(processedQuestions);
        setCurrentQuestionIndex(0);
        setUserAnswers({});
        setAnsweredQuestions({});
        setScoreCount(0);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Failed to load quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizData();
  }, [searchParams]);
  
  // Reset answer input when changing questions
  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const currentQuestionId = questions[currentQuestionIndex].id;
      
      if (userAnswers[currentQuestionId]) {
        const savedAnswer = userAnswers[currentQuestionId];
        
        if (selectedQuizType === "multiple_choice") {
          setSelectedOption(savedAnswer);
          setTextAnswer("");
        } else {
          setTextAnswer(savedAnswer);
          setSelectedOption(null);
        }
        
        // Show feedback if the question has been answered before
        if (answeredQuestions[currentQuestionId]) {
          setShowFeedback(true);
          setIsCorrect(answeredQuestions[currentQuestionId].isCorrect);
        } else {
          setShowFeedback(false);
        }
      } else {
        setSelectedOption(null);
        setTextAnswer("");
        setShowFeedback(false);
      }
    }
  }, [currentQuestionIndex, questions, userAnswers, selectedQuizType, answeredQuestions]);
  
  // Check if the answer is correct
  const checkAnswer = (questionId, userAnswer) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return false;
    
    if (selectedQuizType === "multiple_choice") {
      return userAnswer === question.correct_answer;
    } else if (selectedQuizType === "fill_in_the_blank") {
      // For fill in the blank, do a case-insensitive comparison
      const correctAnswerKey = question.correct_answer;
      const correctAnswerText = question.options[correctAnswerKey]?.toLowerCase();
      return userAnswer.toLowerCase() === correctAnswerText;
    } else {
      // For essay questions, you might want to implement more sophisticated logic
      // For now, we'll consider it correct if it contains key phrases from the correct answer
      const correctAnswerKey = question.correct_answer;
      const correctAnswerText = question.options[correctAnswerKey]?.toLowerCase();
      return userAnswer.toLowerCase().includes(correctAnswerText);
    }
  };
  
  // Handle user interactions
  const handleOptionSelect = (optionKey) => {
    setSelectedOption(optionKey);
  };
  
  const handleTextChange = (e) => {
    setTextAnswer(e.target.value);
  };
  
  const handleQuizTypeSelect = (type) => {
    setSelectedQuizType(type);
    setShowTypeSelector(false);
    
    // Reset answers when changing quiz type
    setUserAnswers({});
    setAnsweredQuestions({});
    setScoreCount(0);
    setSelectedOption(null);
    setTextAnswer("");
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
  };
  
  const isAnswerProvided = () => {
    return selectedQuizType === "multiple_choice" ? 
      selectedOption !== null : 
      textAnswer.trim() !== "";
  };
  
  const handleCheckAnswer = () => {
    if (!isAnswerProvided()) return;
    
    const currentQuestionId = questions[currentQuestionIndex].id;
    const answer = selectedQuizType === "multiple_choice" ? selectedOption : textAnswer;
    
    // Check if the answer is correct
    const correct = checkAnswer(currentQuestionId, answer);
    
    // Update score if this is the first attempt for this question
    if (!answeredQuestions[currentQuestionId]) {
      setScoreCount(prev => correct ? prev + 1 : prev);
    }
    
    // Save current answer and result
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionId]: answer
    }));
    
    setAnsweredQuestions(prev => ({
      ...prev,
      [currentQuestionId]: {
        isCorrect: correct,
        userAnswer: answer
      }
    }));
    
    // Show feedback
    setIsCorrect(correct);
    setShowFeedback(true);
  };
  
  const handleNextQuestion = () => {
    if (!isAnswerProvided()) return;
    
    // If feedback is not shown yet, check the answer first
    if (!showFeedback) {
      handleCheckAnswer();
      return;
    }
    
    // Reset feedback for the next question
    setShowFeedback(false);
    
    // Move to next question or show summary
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Instead of submitting to API, show results
      showQuizResults();
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const showQuizResults = () => {
    // Calculate the final score
    const totalQuestions = questions.length;
    const correctAnswers = Object.values(answeredQuestions).filter(answer => answer.isCorrect).length;
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Create a results object to display
    const resultsData = {
      totalQuestions,
      correctAnswers,
      scorePercentage,
      questionResults: questions.map(question => {
        const questionId = question.id;
        const answered = answeredQuestions[questionId];
        
        return {
          question: question.question_text,
          isCorrect: answered?.isCorrect || false,
          userAnswer: answered?.userAnswer || "Not answered",
          correctAnswer: question.options[question.correct_answer],
          explanation: question.explanation
        };
      })
    };
    
    // Store results in localStorage
    localStorage.setItem("quizResults", JSON.stringify(resultsData));
    
    // Navigate to results page
    navigate(`/quiz-results?id=${quiz.id}`);
  };
  
  const renderQuizTypeSelector = () => {
    return (
      <div className={styles.quizTypeSelection}>
        <h3>Choose Question Type</h3>
        <div className={styles.quizTypeOptions}>
          <button 
            className={`${styles.typeOption} ${selectedQuizType === "multiple_choice" ? styles.selected : ""}`}
            onClick={() => handleQuizTypeSelect("multiple_choice")}
          >
            Multiple Choice
          </button>
          <button 
            className={`${styles.typeOption} ${selectedQuizType === "fill_in_the_blank" ? styles.selected : ""}`}
            onClick={() => handleQuizTypeSelect("fill_in_the_blank")}
          >
            Fill in the Blank
          </button>
          <button 
            className={`${styles.typeOption} ${selectedQuizType === "essay" ? styles.selected : ""}`}
            onClick={() => handleQuizTypeSelect("essay")}
          >
            Essay Questions
          </button>
        </div>
        <button 
          className={styles.startQuizButton}
          onClick={() => setShowTypeSelector(false)}
        >
          Start Quiz
        </button>
      </div>
    );
  };
  
  const renderFeedback = () => {
    if (!showFeedback) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    const feedbackStyle = {
      padding: '16px',
      borderRadius: '8px',
      marginTop: '20px',
      backgroundColor: isCorrect ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
      border: `1px solid ${isCorrect ? '#2ecc71' : '#e74c3c'}`,
      color: isCorrect ? '#27ae60' : '#c0392b',
    };
    
    const iconStyle = {
      display: 'inline-block',
      marginRight: '8px',
      fontSize: '20px',
    };
    
    return (
      <div style={feedbackStyle}>
        <div style={{ fontWeight: '500', marginBottom: '12px' }}>
          <span style={iconStyle}>{isCorrect ? '✓' : '✗'}</span>
          {isCorrect ? 'Correct!' : 'Incorrect!'}
        </div>
        <div style={{ color: '#333', marginBottom: '8px' }}>
          {currentQuestion.explanation}
        </div>
        {!isCorrect && (
          <div style={{ color: '#333' }}>
            <strong>Correct answer:</strong> {currentQuestion.options[currentQuestion.correct_answer]}
          </div>
        )}
      </div>
    );
  };
  
  // Score display
  const renderScoreDisplay = () => {
    if (questions.length === 0) return null;
    
    const answeredCount = Object.keys(answeredQuestions).length;
    
    return (
      <div style={{ 
        position: 'absolute',
        top: '16px',
        right: '24px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: '4px 12px',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '500',
        color: '#fff'
      }}>
        Score: {scoreCount}/{answeredCount}
      </div>
    );
  };
  
  // Use inline styles for the main quiz container to ensure proper width
  if (loading) {
    return (
      <div className="quiz-page-container">
        <Header />
        <main style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="quiz-container-wide">
              <div style={{ padding: '40px', textAlign: 'center' }}>Loading quiz...</div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="quiz-page-container">
        <Header />
        <main style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="quiz-container-wide">
              <div style={{ padding: '40px', textAlign: 'center', color: '#e53935' }}>{error}</div>
              <button 
                style={{ margin: '16px auto', padding: '10px 24px', display: 'block' }}
                onClick={() => navigate('/sessions')}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="quiz-page-container">
        <Header />
        <main style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="quiz-container-wide">
              <div style={{ padding: '40px', textAlign: 'center' }}>
                This quiz has no questions yet.
              </div>
              <button 
                style={{ margin: '16px auto', padding: '10px 24px', display: 'block' }}
                onClick={() => navigate('/sessions')}
              >
                Back to Quizzes
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  if (showTypeSelector) {
    return (
      <div className="quiz-page-container">
        <Header />
        <main style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <div className="quiz-container-wide">
              <div style={{ 
                backgroundColor: '#000', 
                color: '#fff', 
                padding: '16px 24px'
              }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
                  {quiz?.title || "Quiz"}
                </h2>
              </div>
              {renderQuizTypeSelector()}
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // Main quiz view
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  return (
    <div className="quiz-page-container">
      <Header />
      <main style={{ width: '100%' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          width: '100%',
          padding: '0 20px'
        }}>
          <div className="quiz-container-wide" style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}>
            <div style={{ 
              backgroundColor: '#000', 
              color: '#fff', 
              padding: '16px 24px'
            }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
                {quiz?.title || "Quiz"}
              </h2>
              <div style={{ 
                display: 'inline-block',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                marginTop: '8px',
                textTransform: 'capitalize'
              }}>
                {selectedQuizType.replace(/_/g, ' ')}
              </div>
              {renderScoreDisplay()}
              <div style={{ marginTop: '12px' }}>
                <div style={{ 
                  fontSize: '14px', 
                  marginBottom: '6px', 
                  color: '#f0f0f0'
                }}>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: '#222', 
                  borderRadius: '4px', 
                  overflow: 'hidden'
                }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: '#0CC0A3', 
                    borderRadius: '4px', 
                    width: `${progress}%`, 
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>
            </div>
            
            <div style={{ 
              padding: '24px', 
              flexGrow: 1, 
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ 
                fontSize: '18px', 
                fontWeight: 500, 
                marginBottom: '24px', 
                color: '#333'
              }}>
                {currentQuestion.question_text}
              </div>
              
              {/* Render question input using inline styles instead of class names */}
              {selectedQuizType === "multiple_choice" ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(currentQuestion.options || {
                    "a": "Yes",
                    "b": "No",
                    "c": "I will try"
                  }).map(([key, text]) => (
                    <div 
                      key={key} 
                      onClick={() => !showFeedback && handleOptionSelect(key)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        border: selectedOption === key ? 
                          '1px solid #0CC0A3' : '1px solid #e0e0e0',
                        cursor: showFeedback ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        background: selectedOption === key ? 
                          'rgba(12, 192, 163, 0.1)' : '#fff',
                        opacity: showFeedback && selectedOption !== key ? 0.7 : 1,
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedOption === key ? 
                          '2px solid #0CC0A3' : '2px solid #ccc',
                        marginRight: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fff',
                        position: 'relative'
                      }}>
                        {selectedOption === key && (
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: '#0CC0A3'
                          }}></div>
                        )}
                      </div>
                      <div style={{ flex: 1, fontSize: '16px', color: '#333' }}>
                        {text}
                      </div>
                      {showFeedback && key === currentQuestion.correct_answer && (
                        <div style={{
                          marginLeft: '8px',
                          color: '#27ae60',
                          fontWeight: '500'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: '16px' }}>
                  {selectedQuizType === "fill_in_the_blank" ? (
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={handleTextChange}
                      placeholder="Type your answer here..."
                      disabled={showFeedback}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        opacity: showFeedback ? 0.8 : 1
                      }}
                    />
                  ) : (
                    <textarea
                      value={textAnswer}
                      onChange={handleTextChange}
                      placeholder="Write your answer here..."
                      rows={6}
                      disabled={showFeedback}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        minHeight: '200px',
                        resize: 'vertical',
                        opacity: showFeedback ? 0.8 : 1
                      }}
                    />
                  )}
                </div>
              )}
              
              {/* Render feedback */}
              {renderFeedback()}
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px 24px',
              backgroundColor: '#f9fafb',
              borderTop: '1px solid #e0e0e0'
            }}>
              <button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                  backgroundColor: '#f0f0f0',
                  color: '#666',
                  border: 'none',
                  opacity: currentQuestionIndex === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>
              
              <button
                onClick={handleNextQuestion}
                disabled={!isAnswerProvided()}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: isAnswerProvided() ? 'pointer' : 'not-allowed',
                  backgroundColor: '#0CC0A3',
                  color: '#fff',
                  border: 'none',
                  opacity: isAnswerProvided() ? 1 : 0.5
                }}
              >
                {!showFeedback ? "Check Answer" : currentQuestionIndex < questions.length - 1 ? "Next Question" : "Show Results"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}