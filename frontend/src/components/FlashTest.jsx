import React, { useState } from "react";
import "./FlashTest.css";

const questions = [
  { id: 1, question: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
  { id: 2, question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris"], answer: "Paris" },
  { id: 3, question: "What is unique about honey compared to other foods?", options: ["It spoils quickly when exposed to air", "It can never spoil", "It lasts for exactly one year"], answer: "It can never spoil" },
];

const FlashTest = ({ onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [flashCompleted, setFlashCompleted] = useState(false);
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

  const handleFinishFlash = () => {
    const finalScore = answers.filter((answer, index) => answer === questions[index].answer).length;
    setScore(finalScore);
    setFlashCompleted(true);
  };

  return (
    <div className="flash-test-container">
      {flashCompleted ? (
        <div className="flash-summary">
          <h2 className="ResultFlash-title">Flashcard Summary</h2>
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
          <div className="flash-header">
            <h2 className="flash-title">{questions[currentQuestion].question}</h2>
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
            <div className="flash-buttons">
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
                <button onClick={handleFinishFlash} className="finish-btn">
                  Finish Flashcard
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashTest;
