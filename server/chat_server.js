//server/chat_server.js

const express = require("express");
const app = express();
const server = require("http").Server(app);
const { Chat, ChatRoom } = require("./models/Chat");
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT || 3005;

const config = require("./config/key");
const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    dbName: "plug",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connet"))
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

io.on("connection", (socket) => {
  //console.log("연결된 socketID : ", socket.id);
  //io.to(socket.id).emit("my socket id", { socketId: socket.id });

  socket.on("enter chatroom", () => {
    console.log("누군가가 입장함");
    socket.broadcast.emit("receive chat", {
      type: "alert",
      chat: "누군가가 입장하였습니다.",
      regDate: Date.now(),
    });
  });

  socket.on("room", function (room) {
    //I use the user_id of the user to create room

    console.log("방번호:" + room.room);

    socket.join(room.room, () => {
      console.log(room.room + "방입장");
    });
    /*
    io.to(room.Room).emit("notice chat", {
      type: "alert",
      userId: "",
      userName: "",
      msg: `${room.User} 님이 입장하였습니다.`,
      regDate: Date.now(),
    });
    */
  });

  socket.on("send chat", (data) => {
    const msg = {
      type: "chat",
      writer: {
        _id: data.userId,
        image: data.userImage,
        name: data.userName,
      },
      content: data.msg,
      createdAt: Date.now(),
    };

    const params = {
      type: "chat",
      room: data.room,
      writer: data.userId,
      content: data.msg,
    };

    //채팅 보낸사람 채팅룸 열기
    ChatRoom.find({ room: data.room, user: data.userId }).exec(
      (err, chatroom) => {
        if (err) {
          console.log(err);
        }

        if (chatroom.length === 0) {
          const chatRoomData = {
            room: data.room,
            user: data.userId,
          };

          const chatroom = new ChatRoom(chatRoomData);
          chatroom.save((err, chatRoom) => {
            if (err) {
              console.log(err);
            }

            console.log("채팅룸 개설 성공", chatRoom);
          });
        }
      }
    );

    //채팅 받는사람 채팅룸 열기
    ChatRoom.find({ room: data.room, user: data.room }).exec(
      (err, chatroom) => {
        if (err) {
          console.log(err);
        }

        if (chatroom.length === 0) {
          const chatRoomData = {
            room: data.room,
            user: data.room,
          };

          const chatroom = new ChatRoom(chatRoomData);
          chatroom.save((err, chatRoom) => {
            if (err) {
              console.log(err);
            }

            console.log("채팅룸 개설 성공2", chatRoom);
          });
        }
      }
    );

    const chat = new Chat(params);

    chat.save((err, user) => {
      if (err) {
        console.log(err);
      }

      console.log("성공");
    });

    io.to(data.room).emit("receive chat", msg);
  });

  socket.on("room leave", (data) => {
    console.log("leave chatroom ", data);

    const params = {
      type: "alert",
      room: data.room,
      writer: data.userId,
      content: `${data.userName} 님이 퇴장하셨습니다.`,
    };
    const chatAlert = new Chat(params);

    chatAlert.save((err, chat) => {
      if (err) {
        console.log(err);
      }

      io.to(data.room).emit("notice chat", {
        type: "alert",
        userId: data.userId,
        userName: data.userName,
        msg: `${data.userName} 님이 퇴장하셨습니다.`,
        regDate: Date.now(),
      });
    });

    ChatRoom.findOneAndDelete({ room: data.room, user: data.userId }).exec(
      (err, chatRoom) => {
        if (err) return res.status(400).send(err);

        ChatRoom.find({ room: data.room }).exec((err, chatroom) => {
          if (err) {
            console.log(err);
          }

          if (chatroom.length === 0) {
            Chat.deleteMany({ room: data.room }).exec((err, chat) => {
              if (err) return res.status(400).send(err);

              console.log("삭제완료");
            });
          }
        });

        socket.leave(data);
      }
    );
  });

  socket.on("disconnect", function () {
    console.log("서버끊김");
    socket.leave();
  });
});
