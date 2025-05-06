import React, { useState } from "react";
import "./feedback.css";

const Feedback = ({ quizId }) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedbackText.trim()) {
      setError("Please enter some feedback before submitting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setError("You must be logged in to submit feedback.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://127.0.0.1:8080/user/feedback/submit/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quiz_id: quizId,
          feedback: feedbackText,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFeedbackText("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="feedback-container">
      <h3>Share Your Feedback</h3>
      
      {isSubmitted ? (
        <div className="feedback-success">
          <div className="success-icon">✓</div>
          <p>Thank you for your feedback!</p>
          <button 
            className="new-feedback-btn"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="feedback-text">
              Help us improve by sharing your thoughts about this quiz:
            </label>
            <textarea
              id="feedback-text"
              className="feedback-textarea"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="What did you like or dislike about this quiz? Any suggestions for improvement?"
              rows={5}
              disabled={isSubmitting}
            />
          </div>
          
          {error && <div className="feedback-error">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-feedback-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Feedback;