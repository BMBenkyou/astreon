import React, { useState } from "react";
import "./quizList.css"; // Importing CSS for styling

const quizData = [
    {
      "question": "What is pipelining in the context of computer architecture?",
      "answers": [
        { "text": "A technique to increase the clock speed of a processor.", "correct": false },
        { "text": "A method for increasing the number of cores in a processor.", "correct": false },
        { "text": "A technique used to improve performance by executing multiple instructions simultaneously.", "correct": true },
        { "text": "A way to reduce the number of transistors in a processor.", "correct": false }
      ]
    },
    {
      "question": "How does pipelining achieve simultaneous instruction execution?",
      "answers": [
        { "text": "By using multiple processors.", "correct": false },
        { "text": "By breaking down instruction execution into stages that can overlap.", "correct": true },
        { "text": "By predicting the next instruction to be executed.", "correct": false },
        { "text": "By using a single, very fast processor core.", "correct": false }
      ]
    },
    {
      "question": "What are the primary performance metrics for evaluating a pipeline?",
      "answers": [
        { "text": "Clock speed and cache size.", "correct": false },
        { "text": "Instruction count and branch prediction accuracy.", "correct": false },
        { "text": "Throughput and latency.", "correct": true },
        { "text": "Power consumption and heat dissipation.", "correct": false }
      ]
    },
    {
      "question": "What is throughput in a pipelined processor?",
      "answers": [
        { "text": "The time taken for a single instruction to execute.", "correct": false },
        { "text": "The number of instructions completed per unit time.", "correct": true },
        { "text": "The number of pipeline stages.", "correct": false },
        { "text": "The clock speed of the processor.", "correct": false }
      ]
    },
    {
      "question": "What is latency in a pipelined processor?",
      "answers": [
        { "text": "The number of instructions executed per unit time.", "correct": false },
        { "text": "The time taken for a single instruction to complete its execution.", "correct": true },
        { "text": "The length of the pipeline.", "correct": false },
        { "text": "The clock frequency of the processor.", "correct": false }
      ]
    },
    {
      "question": "What are pipeline hazards?",
      "answers": [
        { "text": "Physical damage to the pipeline.", "correct": false },
        { "text": "Situations that prevent instructions from executing as expected in a pipeline.", "correct": true },
        { "text": "Instructions that take longer than expected to execute.", "correct": false },
        { "text": "The time it takes for data to travel through the pipeline.", "correct": false }
      ]
    },
    {
      "question": "What is Instruction-Level Parallelism (ILP)?",
      "answers": [
        { "text": "A technique to increase clock speed.", "correct": false },
        { "text": "The ability to execute multiple instructions simultaneously at the instruction level.", "correct": true },
        { "text": "A type of pipeline hazard.", "correct": false },
        { "text": "A method for improving cache performance.", "correct": false }
      ]
    },
    {
      "question": "What are some techniques to enhance ILP?",
      "answers": [
        { "text": "Increasing clock speed and cache size.", "correct": false },
        { "text": "Reordering, out-of-order execution, speculative execution, and branch prediction.", "correct": true },
        { "text": "Using multiple processors.", "correct": false },
        { "text": "Reducing the number of pipeline stages.", "correct": false }
      ]
    },
    {
      "question": "What is the primary difference between pipelining and ILP?",
      "answers": [
        { "text": "Pipelining focuses on executing instructions simultaneously, while ILP focuses on breaking down execution into stages.", "correct": false },
        { "text": "Pipelining focuses on breaking down instruction execution into stages, while ILP focuses on executing multiple instructions at the same time.", "correct": true },
        { "text": "There is no significant difference between pipelining and ILP.", "correct": false },
        { "text": "Pipelining is a hardware technique, while ILP is a software technique.", "correct": false }
      ]
    },
    {
      "question": "What is a significant advantage of ILP?",
      "answers": [
        { "text": "Reduced complexity of processor design.", "correct": false },
        { "text": "Lower power consumption.", "correct": false },
        { "text": "Improved processor performance by allowing multiple instructions to be executed simultaneously.", "correct": true },
        { "text": "Simplified compiler design.", "correct": false }
      ]
    }
  ];
  export function QuizList() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
  
    const handleAnswerSelection = (answerIndex) => {
      setSelectedAnswers((prevSelectedAnswers) => ({
        ...prevSelectedAnswers,
        [currentQuestionIndex]: answerIndex,
      }));
    };
  
    const goToNextQuestion = () => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        checkAnswers();
      }
    };
  
    const checkAnswers = () => {
      let calculatedScore = 0;
      quizData.forEach((question, index) => {
        const selectedAnswerIndex = selectedAnswers[index];
        if (selectedAnswerIndex !== undefined && question.answers[selectedAnswerIndex].correct) {
          calculatedScore++;
        }
      });
      setScore(calculatedScore);
      setShowScore(true);
    };
  
    const retryQuiz = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setScore(0);
      setShowScore(false);
    };
  
    return (
      <div className="quiz-container">
        <h1 className="quiz-title">Lesson 6</h1>
        {!showScore ? (
          <div className="question-card">
            <p className="question-text">{quizData[currentQuestionIndex].question}</p>
            <div className="answers-container">
              {quizData[currentQuestionIndex].answers.map((answer, answerIndex) => (
                <button
                  key={answerIndex}
                  onClick={() => handleAnswerSelection(answerIndex)}
                  className={`answer-button ${
                    selectedAnswers[currentQuestionIndex] === answerIndex ? "selected" : ""
                  }`}
                >
                  {answer.text}
                </button>
              ))}
            </div>
            <button
              onClick={goToNextQuestion}
              className="submit-button"
              disabled={selectedAnswers[currentQuestionIndex] === undefined}
            >
              {currentQuestionIndex < quizData.length - 1 ? "Next" : "Submit"}
            </button>
          </div>
        ) : (
          <div className="score-card">
            <h2>Your Score: {score} / {quizData.length}</h2>
            <button className="retry-button" onClick={retryQuiz}>
              Retry Quiz
            </button>
          </div>
        )}
      </div>
    );
  }