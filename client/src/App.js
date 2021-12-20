import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from "./hoc/auth.js";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={Auth(LandingPage, null)} />
          <Route path="/login" element={Auth(LoginPage, false)} />
          <Route path="/register" element={Auth(RegisterPage, false)} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
