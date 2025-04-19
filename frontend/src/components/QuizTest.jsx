import React, { useState, useEffect } from "react";
import "./QuizTest.css";

const QuizTest = ({ onExit }) => {
  // Load quiz data from localStorage or use props
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedQuiz = localStorage.getItem("currentQuiz");
  if (storedQuiz) {
    setQuizData(JSON.parse(storedQuiz));
  }
}, []);
  const handleOptionChange = (option) => {
    setSelectedAnswer(option);
  };

  // Go to next question
  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(null);
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  // Go to previous question
  const handlePrevious = () => {
    setSelectedAnswer(answers[currentQuestion - 1]);
    setCurrentQuestion((prev) => prev - 1);
  };

  // Complete the quiz and calculate score
  const handleFinishQuiz = () => {
    // Save the final answer
    const finalAnswers = [...answers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer;
      setAnswers(finalAnswers);
    }

    // Calculate score
    const finalScore = finalAnswers.filter(
      (answer, index) => 
        answer === quizData.questions[index].correct_answer
    ).length;
    
    setScore(finalScore);
    setQuizCompleted(true);
  };

  // Handle quiz exit
  const exitQuiz = () => {
    localStorage.removeItem("currentQuiz");
    if (onExit) {
      onExit();
    } else {
      window.location.href = "/sessions";
    }
  };

  if (loading) {
    return <div className="quiz-loading">Loading quiz...</div>;
  }

  if (!quizData) {
    return (
      <div className="quiz-error">
        <h2>Quiz not found</h2>
        <p>There was an error loading the quiz.</p>
        <button onClick={exitQuiz} className="exit-btn">
          Return to Sessions
        </button>
      </div>
    );
  }

  const questions = quizData.questions;

  return (
    <div className="quiz-test-container">
      {/* Quiz title */}
      <div className="quiz-test-title">
        <h1>{quizData.title}</h1>
      </div>
      
      {quizCompleted ? (
        <div className="quiz-summary">
          <h2 className="ResultQuiz-title">Quiz Summary</h2>
          <div className="result-box">
            <p>You got: {score}/{questions.length}</p>
            <p className="score-percentage">
              {Math.round((score / questions.length) * 100)}%
            </p>
          </div>
          
          {/* Show answers */}
          <div className="answers-review">
            <h3>Review your answers:</h3>
            {questions.map((q, idx) => (
              <div key={idx} className={`answer-item ${answers[idx] === q.correct_answer ? 'correct' : 'incorrect'}`}>
                <p className="question-text">{idx + 1}. {q.question}</p>
                <p className="your-answer">Your answer: {answers[idx] || "Not answered"}</p>
                <p className="correct-answer">Correct answer: {q.correct_answer}</p>
                {q.explanation && <p className="explanation">{q.explanation}</p>}
              </div>
            ))}
          </div>
          
          <button onClick={exitQuiz} className="exit-btn">
            Return to Sessions
          </button>
        </div>
      ) : (
        <>
          {/* Header Section */}
          <div className="quiz-header">
            <h2 className="quiz-title">{questions[currentQuestion].question}</h2>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <span className="progress-number">{currentQuestion + 1}/{questions.length}</span>
            <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
          </div>

          {/* Options and Buttons Wrapper */}
          <div className="options-buttons-wrapper">
            {/* Options */}
            <div className="options-container">
              {questions[currentQuestion].options.map((option, index) => (
                <label key={index} className={`option ${selectedAnswer === option ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={() => handleOptionChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="quiz-buttons">
              {currentQuestion > 0 && (
                <button className="prev-btn" onClick={handlePrevious}>
                  Previous
                </button>
              )}

              {currentQuestion < questions.length - 1 ? (
                <button onClick={handleNext} disabled={selectedAnswer === null} className="next-btn">
                  Next
                </button>
              ) : (
                <button onClick={handleFinishQuiz} className="finish-btn">
                  Finish Quiz
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizTest;