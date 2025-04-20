import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/login"; 
import Signup from "./pages/signup";
import Passwordreset from "./pages/passwordreset";
import Newpassword from "./pages/newpass";
import GenerateSchedule from "./pages/genschedule";
import Profile from "./pages/profile";
import Streak from "./pages/streak";
import PSettings from "./pages/psettings";
import Quiz from "./pages/quiz";
import Aichat from "./pages/ai-chat";
import Flashcards from "./pages/flashcards";
import QuizTaking from "./pages/takequiz";
import Verification from "./pages/verification";
import Session from "./pages/sessions";
import FileChat from "./pages/filechat";
import AddFriend from "./pages/addfriend";
import FriendRequest from "./pages/friendrequest";
import FriendChat from "./pages/friendchat";
import HomeTest from "./pages/homepagetest";
import FlashcardDetail from "./pages/flashcard-details";



const App = () => (
  <div className="app-container">
    <Routes>
      <Route path="/" element={<HomeTest/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/passwordreset" element={<Passwordreset />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/newpass" element={<Newpassword />} />
      <Route path="/genschedule" element={<GenerateSchedule />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/quiz/:quizId" element={<QuizTaking/>} />
      <Route path="/flashcards/:id" element={<FlashcardDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/streak" element={<Streak />} />
      <Route path="/file-chat" element={<FileChat />} />
      <Route path="/psettings" element={<PSettings />} />
      <Route path="/add-friend" element={<AddFriend/>} />
      <Route path="/friend-request" element={<FriendRequest/>} />
      <Route path="/friend-chat" element={<FriendChat/>} />
      <Route path="/ai" element={<Aichat />} />
      <Route path="/flashcards" element={<Flashcards />} />
      <Route path="/sessions" element={<Session />} />
    </Routes>
  </div>
);

export default App;

