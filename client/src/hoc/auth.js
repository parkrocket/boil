import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_actions.js";
import { useNavigate } from "react-router";

export default function (SpecificComponent, option, adminRoute = null) {
  function AuthenticationCheck() {
    // null => 아무나 출입 가능
    // true => 로그인한 유저만 출입가능
    // false => 로그인 안한 유저만 출입가능
    let navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(auth()).then((response) => {
        if (!response.payload.isAuth) {
          // 로그인 하지 않은 상태
          if (option) {
            navigate("/login");
          }
        } else {
          // 로그인 한 상태
          if (adminRoute && !response.payload.isAdmin) {
            //관리자페이지를 관리자 권한이 없는 사람이 들어가려고 할때
            alert("너 관리자 아니자나");
            navigate("/");
          } else {
            if (option === false) {
              //로그인한 유저가 로그인하면 안되는 페이지로 들어가려고 할때
              navigate("/");
            }
          }
        }
      });
    }, []);
    return <SpecificComponent></SpecificComponent>;
  }
  return (
    <div>
      <AuthenticationCheck></AuthenticationCheck>
    </div>
  );
}
