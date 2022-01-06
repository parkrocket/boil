import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ChatMain() {
  const [UserList, setUserList] = useState([]);
  const [ChatRoomList, setChatRoomList] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const userData = {
      userId: userId,
    };
    axios
      .get(process.env.REACT_APP_DB_HOST + "/api/users/userInfoAll")
      .then((response) => {
        if (response.data.success) {
          setUserList(response.data.users);
        } else {
          alert("유저정보 실패");
        }
      });

    axios
      .post(
        process.env.REACT_APP_DB_HOST + "/api/chat/myChatRoomList",
        userData
      )
      .then((response) => {
        if (response.data.success) {
          setChatRoomList(response.data.chatRoom);
        } else {
          alert("채팅룸 정보 로드 실패");
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

  const render2 = ChatRoomList.map((chatRoom, index) => {
    return (
      <li key={index}>
        <Link to={`/chat/${chatRoom.room._id}`}>
          {chatRoom.room._id} 채팅방
        </Link>
      </li>
    );
  });

  return (
    <div>
      <div>
        <h1>유저정보</h1>
        <ul>{render}</ul>
      </div>

      <div>
        <h1>나의 채팅룸</h1>
        <ul>{render2}</ul>
      </div>
    </div>
  );
}

export default ChatMain;
