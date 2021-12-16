const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/key");

const { User } = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connet"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("안녕하세요 :)");
});

app.post("/register", (req, res) => {
  // 회원가입 필요한 정보를 클라이언트에서 가져오면
  // 그 데이터를 데이터베이스에 INSERT
  const user = new User(req.body);

  //mongodb
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
