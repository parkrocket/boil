import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.get("/api/hello").then((response) => console.log(response));
  }, []);

  const LogoutHandler = () => {
    axios.get("/api/users/logout").then((response) => {
      if (response.data.success) {
        return alert("로그아웃 성공");
      } else {
        return alert("로그아웃이 실패하였습니다");
      }
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <h2>시작 페이지</h2>

      <button onClick={LogoutHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
