const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const io = require("socket.io");

const mongoose = require("mongoose");
const connect = mongoose
  .connect(config.mongoURI, {
    dbName: "plug",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connet"))
  .catch((err) => console.log(err));

app.use(cors());

app.use("/uploads", express.static("./uploads"));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
} else {
  mongoose.set("debug", true);
}

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

app.use(cookieParser());

//회원 관련 라우터
app.use("/api/users", require("./routes/users"));

//비디오 업로드 라우터
app.use("/api/video", require("./routes/video"));

//구독 라우터
app.use("/api/subscribe", require("./routes/subscribe"));

//코멘트 라우터
app.use("/api/comment", require("./routes/comment"));

//좋아요 싫어요 라우터
app.use("/api/like", require("./routes/likedislikes"));

//게시판 라우터
app.use("/api/board", require("./routes/board"));

//에디터 라우터
app.use("/api/board/editorimage", require("./routes/editorImage"));

//채팅 라우터
app.use("/api/chat", require("./routes/chat"));

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
