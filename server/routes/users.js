const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

//인증
router.get("/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 이야기는 인증이 TRUE 라는 말

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

//회원가입
router.post("/register", (req, res) => {
  // 회원가입 필요한 정보를 클라이언트에서 가져오면
  // 그 데이터를 데이터베이스에 INSERT
  const user = new User(req.body);

  //mongodb
  user.save((err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//로그인
router.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당되는 유저가 없습니다.",
      });
    }

    //비밀번호 매치하기
    user.comparePassword(req.body.password, (err, isMatch) => {
      // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인한다.

      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      }
      //비밀번호가 같다면 토큰을 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
        //토큰을 저장한다.
      });
    });
  });
});

//로그아웃
router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).send({ success: true });
  });
});

module.exports = router;
