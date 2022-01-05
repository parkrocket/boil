//server/chat_server.js

const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3005;

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("연결된 socketID : ", socket.id);
  io.to(socket.id).emit("my socket id", { socketId: socket.id });

  socket.on("enter chatroom", () => {
    console.log("누군가가 입장함");
    socket.broadcast.emit("receive chat", {
      type: "alert",
      chat: "누군가가 입장하였습니다.",
      regDate: Date.now(),
    });
  });

  socket.on("room", function (user_id) {
    //I use the user_id of the user to create room
    socket.join(user_id, () => {
      console.log(user_id + "방입장");
    });
  });

  socket.on("send chat", (data) => {
    console.log(data.room);
    const msg = {
      userId: data.userId,
      userName: data.userName,
      msg: data.msg,
    };
    console.log(msg);
    io.to(data.room).emit("receive chat", msg);
  });

  socket.on("leave chatroom", (data) => {
    console.log("leave chatroom ", data);
    socket.broadcast.emit("receive chat", {
      type: "alert",
      chat: "누군가가 퇴장하였습니다.",
      regDate: Date.now(),
    });
  });
});
