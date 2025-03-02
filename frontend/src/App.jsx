import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/Homepage.jsx";
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
import { Aichat } from './pages/ai-chat.jsx';

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/homepage" element={<HomePage />} />
              <Route path="/ai-chat" element={<Aichat />} />
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
        </Router>
    );
}

export default App;

