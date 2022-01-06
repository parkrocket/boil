import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Chat.css";
import { Avatar } from "antd";

const socket = io(process.env.REACT_APP_CHAT_SERVER_HOST);

function LandingPage() {
  const [ChatMsg, setChatMsg] = useState("");
  const [ChatList, setChatList] = useState([]);
  const chatRoom = useParams();
  const user = useSelector((state) => state.user);
  const userId = localStorage.getItem("userId");
  const scrollRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = {
      userData: {
        _id: userId,
      },
    };
    axios
      .post(process.env.REACT_APP_SERVER_HOST + "/api/users/userInfo", userData)
      .then((response) => {
        if (response.data.success) {
          const roomData = {
            room: chatRoom.roomId,
            userName: response.data.user.name,
            userId: response.data.user._id,
          };
          socket.emit("room", roomData);

          axios
            .post(
              process.env.REACT_APP_SERVER_HOST + "/api/chat/chatList",
              roomData
            )
            .then((response) => {
              if (response.data.success) {
                setChatList(response.data.chat);
                const { scrollHeight, clientHeight } = scrollRef.current;
                scrollRef.current.scrollTop = scrollHeight - clientHeight;
              } else {
                alert("실패!");
              }
            });
        } else {
          alert("실패");
        }
      });

    socket.on("receive chat", (data) => {
      console.log("App.js Socket(receive chat) ", data);
      setChatList((ChatList) => [...ChatList, data]);
      //console.log("정보:", ChatList, data);
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTop = scrollHeight - clientHeight;
    });

    socket.on("notice chat", (data) => {
      console.log("정보:", data);
      setChatList((ChatList) => [...ChatList, data]);
    });
  }, []);

  const onChatHandler = (e) => {
    setChatMsg(e.target.value);
  };

  const onSubmitHandler = (e) => {
    console.log(user.userData.image);
    e.preventDefault();
    socket.emit("send chat", {
      userId: user.userData._id,
      userName: user.userData.name,
      userImage: user.userData.image,
      msg: ChatMsg,
      room: chatRoom.roomId,
    });
    setChatMsg("");
  };
  console.log(ChatList);
  const render = ChatList.map((chat, index) => {
    if (chat.type !== "alert") {
      return (
        <li key={index} className={userId === chat.writer._id ? `mychat` : ``}>
          {userId === chat.writer._id ? (
            <p>
              <span className="msgwrap">{chat.content}</span>
            </p>
          ) : (
            <p>
              <span className="profile">
                <Avatar
                  src={
                    chat.writer.image &&
                    `${process.env.REACT_APP_SERVER_HOST}/${chat.writer.image}`
                  }
                ></Avatar>
                <span className="chatnick">{chat.writer.name}</span>
              </span>
              <span className="msgwrap">{chat.content}</span>
            </p>
          )}
        </li>
      );
    } else {
      return (
        <li key={index} style={{ textAlign: "center", fontWeight: "600" }}>
          {chat.content}
        </li>
      );
    }
  });

  const onExitHandler = () => {
    console.log(chatRoom.roomId, userId);
    //alert("나가기");

    //socket.emit("room leave", chatRoom.roomId);
    socket.emit("room leave", {
      userId: user.userData._id,
      userName: user.userData.name,
      userImage: user.userData.image,
      msg: ChatMsg,
      room: chatRoom.roomId,
    });

    navigate("/chat");
  };

  const onBackHandler = () => {
    navigate("/chat");
  };

  return (
    <div className="chat_container">
      <div className="chat_con">
        <div className="chat_head">
          <button
            className="exit_btn"
            onClick={onBackHandler}
          >{`< 뒤로`}</button>
          <button
            className="exit_btn"
            onClick={onExitHandler}
          >{` 채팅방 나가기`}</button>
        </div>
        <div className="chatwrap" ref={scrollRef}>
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
