import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./views/LandingPage/LandingPage";
import LoginPage from "./views/LoginPage/LoginPage";
import RegisterPage from "./views/RegisterPage/RegisterPage";
import Admin from "./views/Admin/Main";
import Auth from "../hoc/auth.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer";
import VideoUploadPage from "./views/VideoUploadPage/VideoUploadPage";
import VideoDetailPage from "./views/VideoDetailPage/VideoDetailPage";

function App() {
  // null => 아무나 출입 가능
  // true => 로그인한 유저만 출입가능
  // false => 로그인 안한 유저만 출입가능
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <NavBar></NavBar>
        <div style={{ paddingTop: "69px", minHeight: "calc(100vh - 80px)" }}>
          <Routes>
            <Route path="/" element={Auth(LandingPage, null)} />
            <Route path="/login" element={Auth(LoginPage, false)} />
            <Route path="/register" element={Auth(RegisterPage, false)} />
            <Route path="/video/upload" element={Auth(VideoUploadPage, true)} />
            <Route
              path="/video/:videoId"
              element={Auth(VideoDetailPage, null)}
            />
            <Route path="/admin" element={Auth(Admin, true, true)} />
          </Routes>
        </div>
        <Footer></Footer>
      </Suspense>
    </Router>
  );
}

export default App;
