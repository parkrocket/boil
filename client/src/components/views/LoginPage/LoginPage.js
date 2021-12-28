import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_actions";
import { useNavigate } from "react-router";
import { CLIENTID, CALLBACKURL } from "../../../config/SocialConfig";

function LoginPage() {
  let navigate = useNavigate();

  const dispatch = useDispatch();
  const { naver } = window;

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const onEmailHandler = (event) => {
    setEmail(event.currentTarget.value);
  };

  const onPasswordHandler = (event) => {
    setPassword(event.currentTarget.value);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    let body = { email: Email, password: Password };

    dispatch(loginUser(body)).then((response) => {
      if (response.payload.loginSuccess) {
        window.localStorage.setItem("userId", response.payload.userId);
        navigate("/");
      } else {
        alert("Error");
      }
    });
  };

  const initializeNaverLogin = () => {
    const naverLogin = new naver.LoginWithNaverId({
      clientId: CLIENTID,
      callbackUrl: CALLBACKURL,
      isPopup: false, // popup 형식으로 띄울것인지 설정
      loginButton: { color: "white", type: 1, height: "47" }, //버튼의 스타일, 타입, 크기를 지정
    });
    naverLogin.init();
  };

  useEffect(() => {
    initializeNaverLogin();
  }, []);

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
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler}></input>
        <label>password</label>
        <input
          type="password"
          value={Password}
          onChange={onPasswordHandler}
        ></input>
        <br />
        <div id="naverIdLogin" />
        <br />
        <button>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
