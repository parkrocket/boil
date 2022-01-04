import axios from "axios";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_CHAT_SERVER_HOST);

function LandingPage() {
  const [ChatMsg, setChatMsg] = useState("");
  const [ChatList, setChatList] = useState([]);

  useEffect(() => {
    socket.on("receive chat", (data) => {
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
    socket.emit("send chat", { msg: ChatMsg });
    setChatMsg("");
  };
  // console.log(ChatList);
  const render = ChatList.map((board, index) => {
    return <li key={index}>{board.msg}</li>;
  });

  return (
    <div>
      <div>
        <ul>{render}</ul>
      </div>
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          onChange={onChatHandler}
          value={ChatMsg || ""}
        ></input>
        <button onSubmit={onSubmitHandler}>전송</button>
      </form>
    </div>
  );
}

export default LandingPage;
