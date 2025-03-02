import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/Homepage.jsx";
import { Aichat } from './pages/ai-chat.jsx';


function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/HomePage" element={<HomePage />} />
                <Route path="/Aichat" element={<Aichat />} />

              </Routes>
        </Router>
    );
}

export default App;
