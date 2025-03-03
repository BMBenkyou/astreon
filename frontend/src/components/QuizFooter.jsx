import React, { useState } from "react";
import { AiOutlinePaperClip, AiOutlineSend } from "react-icons/ai";
import { supabase } from "../supabaseClient";
import QuizModal from "./QuizModal";
import "./QuizFooter.css";

const QuizFooter = ({ onStartQuiz }) => {
  const [prompt, setPrompt] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);

  const handleSend = async () => {
    if (prompt.trim() === "") return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to generate a quiz!");
      }

      console.log("Auth Session:", session);  // Debug log
      console.log("Access Token:", session.access_token);  // Debug log

      const response = await fetch("http://127.0.0.1:8080/api/quizzes/generate/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.access_token}`,
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          title: "AI Generated Quiz"
        }),
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server Response:", errorData);  // Debug log
        throw new Error(errorData.error_message || "Failed to generate quiz");
      }

      const data = await response.json();
      setGeneratedQuiz(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error generating quiz:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error("You must be logged in to generate a quiz!");
        }

        const formData = new FormData();
        formData.append("message", "Generate a quiz based on this file content");
        formData.append("title", "File Based Quiz");
        formData.append("files", file);

        const response = await fetch("http://127.0.0.1:8080/api/quizzes/generate/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${session?.access_token}`,
            "Accept": "application/json",
            "Content-Type": "multipart/form-data"
          },
          body: formData,
          mode: 'cors',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error_message || "Failed to generate quiz");
        }

        const data = await response.json();
        setGeneratedQuiz(data);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error processing file:", error);
        setError(error.message);
      }
    }
  };

  return (
    <>
      <div className="quiz-footer">
        {/* Attachment Button */}
        <label className="footer-btn attach-bton">
          <AiOutlinePaperClip className="footer-icon" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx,.txt"
          />
        </label>

        {/* Input Field */}
        <input
          type="text"
          className="quiz-footer-input"
          placeholder="Generate a quiz based on this topic or upload a file"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isSubmitting}
        />

        {/* Send Button */}
        <button 
          className="send-btn" 
          onClick={handleSend}
          disabled={isSubmitting || !prompt.trim()}
        >
          <div className="svg-wrapper">
            <AiOutlineSend className="footer-icon send-icon" />
          </div>
          <span>{isSubmitting ? "Generating..." : "Generate Quiz"}</span>
        </button>
      </div>

      {error && (
        <div className="error-message mt-2 text-red-500 text-center">
          {error}
        </div>
      )}

      {/* Modal Component */}
      <QuizModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setGeneratedQuiz(null);
        }}
        promptText={prompt}
        quizData={generatedQuiz}
        onStartQuiz={() => {
          setIsModalOpen(false);
          if (generatedQuiz) {
            onStartQuiz(generatedQuiz);
          }
        }}
      />
    </>
  );
};

export default QuizFooter;
