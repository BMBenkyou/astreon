import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from "./pages/Homepage.jsx";

function App() {
  return (
      <Router>
          <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/chatbox" element={<HomePage />} />

              </Routes>
        </Router>
    );
}

export default App;
