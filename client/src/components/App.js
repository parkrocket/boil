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
import SubscriptionPage from "./views/SubscriptionPage/SubscriptionPage";
import Mypage from "./views/Mypage/Mypage";
import Naver from "./views/LoginPage/Social/Naver";
import BoardUploadPage from "./views/Board/BoardUploadPage/BoardUploadPage";
import BoardListPage from "./views/Board/BoardListPage/BoardListPage";
import BoardDetailPage from "./views/Board/BoardDetailPage/BoardDetailPage";
import ChatPage from "./views/Chat/ChatPage";
import ChatMain from "./views/Chat/ChatMain";

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
            <Route path="/chat" element={Auth(ChatMain, true)} />
            <Route path="/chat/:roomId" element={Auth(ChatPage, true)} />

            <Route path="/board/upload" element={Auth(BoardUploadPage, true)} />
            <Route path="/board/list" element={Auth(BoardListPage, null)} />
            <Route
              path="/board/view/:boardId"
              element={Auth(BoardDetailPage, null)}
            />
            <Route
              path="/subscription"
              element={Auth(SubscriptionPage, true)}
            />
            <Route path="/mypage" element={Auth(Mypage, true)} />

            <Route path="/auth/naver" element={Auth(Naver, false)} />

            <Route path="/admin" element={Auth(Admin, true, true)} />
          </Routes>
        </div>
        <Footer></Footer>
      </Suspense>
    </Router>
  );
}

export default App;
