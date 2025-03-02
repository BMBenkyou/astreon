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
import Home from "./pages/home";
import Quiz from "./pages/quiz";


const App = () => (
  <div className="app-container">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/passwordreset" element={<Passwordreset />} />
      <Route path="/newpass" element={<Newpassword />} />
      <Route path="/genschedule" element={<GenerateSchedule />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/streak" element={<Streak />} />
      <Route path="/psettings" element={<PSettings />} />
    </Routes>
  </div>
);

export default App;

