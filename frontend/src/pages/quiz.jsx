import { useState } from "react";
import { supabase } from "../supabaseClient";
import QuizBody from "../components/QuizBody";
import QuizFooter from "../components/QuizFooter";
import QuizTest from "../components/QuizTest";
import "./quiz.css";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Get current logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to create a quiz!");
      }

      const quizData = {
        user_id: user.id,
        title,
        body,
      };

      const response = await fetch("http://127.0.0.1:8000/api/quizzes/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quizData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create quiz");
      }

      const data = await response.json();
      console.log("Quiz created:", data);
      
      // Reset form and show success
      setTitle("");
      setBody("");
      setIsQuizStarted(true);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setIsQuizStarted(true);
  };

  const handleExitQuiz = () => {
    setIsQuizStarted(false);
  };

  return (
    <div className="MainContaineR">
      <div className="nav-body">
        {isQuizStarted ? (
          <QuizTest onExit={handleExitQuiz} />
        ) : (
          <>
            <QuizBody 
              title={title}
              setTitle={setTitle}
              body={body}
              setBody={setBody}
            />
            <QuizFooter onStartQuiz={handleStartQuiz} />
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {loading && (
              <div className="loading-message">
                Creating quiz...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CreateQuiz;
