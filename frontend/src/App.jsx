import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatBox } from "./pages/chatbox.jsx";
import { Welcome } from "./pages/welcome.jsx";
import { Login } from "./pages/login.jsx";
import { SignUp } from "./pages/signUp.jsx";
import { Session } from "./pages/session.jsx"; 
import { Quiz } from "./pages/quiz.jsx";
import { Flashcards} from "./pages/flashcards.jsx";
import {Calendar} from "./pages/calendar.jsx";
import { Schedule } from './pages/schedule.jsx';
import { Profile } from "./pages/profile.jsx";
import {QuizList} from './pages/quizList';
import { FlashcardList } from './pages/flashcardList.jsx';
import { QuizSummary } from './pages/quizSummary';
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/chatbox" element={<ChatBox />} />
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sessions" element={<Session />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/quizme" element={<Quiz />} />
                <Route path="/schedule" element={<Schedule/>} />
                <Route path="/sessions" element={<Session />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/quiz-detail/:id" element={<QuizList />} />
                <Route path="/flashcard-detail/:id" element={<FlashcardList />} /> 
                <Route path="/quiz-summary" element={<QuizSummary />} />
              
                
            </Routes>
        </Router>
    );
}

export default App;
