import { useLocation } from 'react-router-dom';
import  {Header}  from "../components/headerLoggedin";
import { Footer } from "../components/footer";
import "./quizSummary.css"; 

export function QuizSummary() {
    const location = useLocation();
    const { quizDetails, selectedAnswers } = location.state || {};
    
    if (!quizDetails) {
        return <p>No quiz data available.</p>;
    }

    let correctCount = 0;

    const summary = quizDetails.questions.map((question, index) => {
        const userAnswer = selectedAnswers[index];
        const isCorrect = userAnswer && userAnswer.correct;

        if (isCorrect) correctCount++;

        return (
            <div key={index} className="summary-item">
                <h4>Question {index + 1}:</h4>
                <p>{question.question}</p>
                <p>Your answer: <strong>{userAnswer ? userAnswer.text : "No answer"}</strong></p>
                <p className={isCorrect ? 'correct' : 'incorrect'}>
                 {isCorrect ? "Correct" : "Incorrect"}
                </p> 
            </div>
        );
    });

    return (
        <div className="body">
            <Header />
            <div className="summary-container">
                <h2>Quiz Summary</h2>
                <p>Total Score: {correctCount}/{quizDetails.questions.length}</p>
                {summary}
            </div>
            <Footer />
        </div>
    );
}
