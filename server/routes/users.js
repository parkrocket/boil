const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const sharp = require("sharp");
const axios = require("axios");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/profile/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg") {
    cb(null, true);
  } else {
    cb({ msg: "업로드 불가능한 확장자입니다." }, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

//=================================
//             User
//=================================

//인증

router.post("/auth", auth, (req, res) => {
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

        res.cookie("x_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
          userToken: user.token,
        });
        //토큰을 저장한다.
      });
    });
  });
});

//로그아웃
router.post("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).send({ success: true });
  });
});

//프로필  이미지 업로드
router.post("/uploadProfile", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    try {
      sharp(res.req.file.path)
        .resize(50, 50)
        .withMetadata()
        .toFile(
          `uploads/profile/thumbnails/${res.req.file.filename}`,
          (err, info) => {
            if (err) {
              return res.json({ success: false, err });
            }
            return res.json({
              success: true,
              url: res.req.file.path,
              thumbnailPath: `uploads/profile/thumbnails/${res.req.file.filename}`,
              fileName: res.req.file.filename,
            });
          }
        );
    } catch (err) {
      console.log(err);
      return res.json({ success: false, err });
    }
  });
});

router.post("/updateUser", (req, res) => {
  console.log(req.body);

  const data = {
    image: req.body.profileImagePath,
    name: req.body.name,
  };

  User.findOneAndUpdate({ _id: req.body.userId }, data, (err, user) => {
    if (err) return res.json({ success: false, err });

    return res.status(200).send({ success: true, user });
  });
});

router.post("/naver", function (req, res) {
  code = req.body.token;
  state = req.body.state;

  api_url = `https://openapi.naver.com/v1/nid/me`;
  const data = {};
  const config = {
    headers: {
      Authorization: `bearer ${code}`,
      "X-Naver-Client-Id": req.body.clientId,
      "X-Naver-Client-Secret": req.body.clientSecret,
    },
  };

  axios.post(api_url, data, config).then((response) => {
    User.findOne({ naverId: response.data.response.id }, (err, user) => {
      if (!user) {
        const userData = {
          name: response.data.response.nickname,
          email: response.data.response.email,
          naverId: response.data.response.id,
        };

        const user = new User(userData);

        //회원가입
        user.save((err, user) => {
          if (err) return res.json({ success: false, err });
          //회원가입 완료후 로그인
          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);

            res.cookie("x_auth", user.token).status(200).json({
              loginSuccess: true,
              userId: user._id,
              userToken: user.token,
            });
          });
        });
      } else {
        // 이미 회원일 경우 로그인
        user.generateToken((err, user) => {
          if (err) return res.status(400).send(err);

          res.cookie("x_auth", user.token).status(200).json({
            loginSuccess: true,
            userId: user._id,
            userToken: user.token,
          });
          //토큰을 저장한다.
        });
      }
    });
  });
});

module.exports = router;
