import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ChatMain() {
  const [UserList, setUserList] = useState([]);

  useEffect(() => {
    axios.get("/api/users/userInfoAll").then((response) => {
      if (response.data.success) {
        setUserList(response.data.users);
      } else {
        alert("유저정보 실패");
      }
    });
  }, []);

  const render = UserList.map((user, index) => {
    return (
      <li key={index}>
        <Link to={`/chat/${user._id}`}>{user.name}</Link>
      </li>
    );
  });

  return (
    <div>
      <ul>{render}</ul>
    </div>
  );
}

export default ChatMain;
