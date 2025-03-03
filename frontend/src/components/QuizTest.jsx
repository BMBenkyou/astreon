import React, { useState } from "react";
import "./QuizTest.css";

const QuizTest = ({ onExit, quizData }) => {
  const questions = quizData?.questions || [];
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleOptionChange = (option) => {
    setSelectedAnswer(option);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      setSelectedAnswer(answers[currentQuestion + 1] || null);
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setSelectedAnswer(answers[currentQuestion - 1]);
    setCurrentQuestion((prev) => prev - 1);
  };

  const handleFinishQuiz = () => {
    const finalScore = answers.filter(
      (answer, index) => answer === questions[index].correct_answer
    ).length;
    setScore(finalScore);
    setQuizCompleted(true);
  };

  if (!questions.length) {
    return (
      <div className="quiz-test-container">
        <div className="quiz-error">
          <h2>No questions available</h2>
          <button onClick={onExit} className="exit-btn">
            Exit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-test-container">
      {quizCompleted ? (
        <div className="quiz-summary">
          <h2 className="ResultQuiz-title">Quiz Summary</h2>
          <div className="result-box">
            <p>You got: {score}/{questions.length}</p>
          </div>
          <button onClick={onExit} className="exit-btn">
            Exit
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
            <span className="progress-number">{currentQuestion + 1}</span>
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
