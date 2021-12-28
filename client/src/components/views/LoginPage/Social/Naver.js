import axios from "axios";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CLIENTID,
  CLIENTSECRET,
  CALLBACKURL,
} from "../../../../config/SocialConfig";

function Naver() {
  const location = useLocation();

  const token = location.hash.split("=")[1].split("&")[0];
  const state = location.hash.split("=")[2].split("&")[0];
  const navigate = useNavigate();

  const data = {
    token: token,
    state: state,
    clientId: CLIENTID,
    clientSecret: CLIENTSECRET,
    callbackUrl: CALLBACKURL,
  };

  axios.post("/api/users/naver", data).then((response) => {
    console.log(response.data);
    if (response.data.success) {
      console.log(response.data);
    } else if (response.data.loginSuccess) {
      navigate("/");
    } else {
      alert("토큰전달 실패");
    }
  });

  return <div>Naver</div>;
}

export default Naver;
