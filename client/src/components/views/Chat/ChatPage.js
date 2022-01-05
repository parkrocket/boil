import axios from "axios";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Chat.css";
import { Avatar } from "antd";

const socket = io(process.env.REACT_APP_CHAT_SERVER_HOST);

function LandingPage() {
  const [ChatMsg, setChatMsg] = useState("");
  const [ChatList, setChatList] = useState([]);
  const chatRoom = useParams();
  const user = useSelector((state) => state.user);

  useEffect(() => {
    socket.emit("room", chatRoom.roomId);
    socket.on("receive chat", (data) => {
      console.log(data);
      console.log("App.js Socket(receive chat) ", data);
      setChatList((ChatList) => [...ChatList, data]);
      //console.log("정보:", ChatList, data);
    });
  }, []);

  const onChatHandler = (e) => {
    setChatMsg(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    socket.emit("send chat", {
      userId: user.userData._id,
      userName: user.userData.name,
      msg: ChatMsg,
      room: chatRoom.roomId,
    });
    setChatMsg("");
  };
  // console.log(ChatList);
  const render = ChatList.map((chat, index) => {
    console.log(user.userData._id, chat.userId);
    return (
      <li
        key={index}
        className={user.userData._id == chat.userId ? `mychat` : ``}
      >
        {user.userData._id == chat.userId ? (
          <p>
            <span className="msgwrap">{chat.msg}</span>
          </p>
        ) : (
          <p>
            <span className="profile">
              <Avatar
                src={`${process.env.REACT_APP_SERVER_HOST}/${user.userData.image}`}
              ></Avatar>
              <span className="chatnick">{chat.userName}</span>
            </span>
            <span className="msgwrap">{chat.msg}</span>
          </p>
        )}
      </li>
    );
  });

  return (
    <div className="chat_container">
      <div className="chat_con">
        <div className="chatwrap">
          <ul>{render}</ul>
        </div>
        <form onSubmit={onSubmitHandler} className="chatform">
          <input
            type="text"
            onChange={onChatHandler}
            value={ChatMsg || ""}
            className="chatinput"
          ></input>
          <button onSubmit={onSubmitHandler} className="chatsubmitbtn">
            전송
          </button>
        </form>
      </div>
    </div>
  );
}

export default LandingPage;
