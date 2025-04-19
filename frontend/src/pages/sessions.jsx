import { useState, useEffect } from "react";
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
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    // Fetch quizzes using the Fetch API
    fetch("http://127.0.0.1:8000/api/get-saved-quizzes/")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setQuizzes(data.quizzes);
        }
      })
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  return (
    <>
      <header>
        <Header />
      </header>

      <main>
        <div className="grid-container-sidebar">
          <div className="sidebar-sessions">
            <Sidebar />
          </div>
          <div className="main-sessions-grid">
            <p>Quizzes</p>
            <div className="sessions-container-quizzes">
              {quizzes.map((q, index) => (
                <SessionCard key={index} title={q.title} description="Click to view questions." />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
