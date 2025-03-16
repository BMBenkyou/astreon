import { useState, useRef } from "react";
import Header from "../components/HeaderLoggedIn";
import Sidebar from "../components/NSidebar";
import "./sessions.css";

const sessionicon = "/session-icon.svg";

const SessionCard = ({ title, description }) => (
  <div className="sessions-div">
    <div className="session-header">
      <p className="session-title">{title}</p>
      <img src={sessionicon} alt="session-icon" className="session-icon" />
    </div>
    <p className="session-description">{description}</p>
  </div>
);

export default function Sessions() {
  const [quizzes, setQuizzes] = useState([
    { title: "RVA", description: "Didn't find anything? Create your own system suitable for your needs" }
  ]);
  const [flashcards, setFlashcards] = useState([
    { title: "Title", description: "Description of this flashcard is truncated if too long." }
  ]);
  const [aiSessions, setAiSessions] = useState([
    { title: "AI Chat", description: "This session is AI-powered. Interact and get instant feedback!" }
  ]);

  const quizRef = useRef(null);
  const flashcardRef = useRef(null);
  const aiRef = useRef(null);

  // Function to add a new session card dynamically
  const addSession = (type) => {
    const newCard = { 
      title: "New Session", 
      description: "This is a dynamically added session. It will truncate if too long." 
    };

    if (type === "quiz") {
      setQuizzes(prev => [...prev, newCard]);
      setTimeout(() => quizRef.current.scrollLeft = quizRef.current.scrollWidth, 200);
    } else if (type === "flashcard") {
      setFlashcards(prev => [...prev, newCard]);
      setTimeout(() => flashcardRef.current.scrollLeft = flashcardRef.current.scrollWidth, 200);
    } else if (type === "ai") {
      setAiSessions(prev => [...prev, newCard]);
      setTimeout(() => aiRef.current.scrollLeft = aiRef.current.scrollWidth, 200);
    }
  };

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        <div className="grid-container-sidebar">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="main-sessions-grid">
            <p>Quizzes <button onClick={() => addSession("quiz")}>Add</button></p>
            <div className="sessions-container-quizzes" ref={quizRef}>
              {quizzes.map((q, index) => (
                <SessionCard key={index} title={q.title} description={q.description} />
              ))}
            </div>

            <p>Flashcards <button onClick={() => addSession("flashcard")}>Add</button></p>
            <div className="sessions-container-flashcards" ref={flashcardRef}>
              {flashcards.map((f, index) => (
                <SessionCard key={index} title={f.title} description={f.description} />
              ))}
            </div>

            <p>AI Sessions <button onClick={() => addSession("ai")}>Add</button></p>
            <div className="sessions-container-aichat" ref={aiRef}>
              {aiSessions.map((ai, index) => (
                <SessionCard key={index} title={ai.title} description={ai.description} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
