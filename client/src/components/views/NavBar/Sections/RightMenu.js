/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { Menu } from "antd";
import axios from "axios";
import { Avatar } from "antd";
import { USER_SERVER } from "../../../Config";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function RightMenu(props) {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  console.log();
  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        localStorage.removeItem("userId");
        navigate("/login");
      } else {
        alert("Log Out Failed");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="mail">
          <Link to="/login">Signin</Link>
        </Menu.Item>
        <Menu.Item key="app">
          <Link to="/register">Signup</Link>
        </Menu.Item>
      </Menu>
    );
  } else if (user.userData) {
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="profile">
          <Link to="/mypage">
            <Avatar
              src={
                user.userData.image
                  ? `http://localhost:5000/${user.userData.image}`
                  : ""
              }
            ></Avatar>
            <span>{user.userData.name}</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="upload">
          <Link to="/board/upload">글쓰기</Link>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  } else {
    return <div>...Loading</div>;
  }
}

export default RightMenu;
