const express = require("express");
const router = express.Router();
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");
const { auth } = require("../middleware/auth");
const multer = require("multer");

const ffmpeg = require("fluent-ffmpeg");

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/board/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/gif"
  ) {
    cb(null, true);
  } else {
    cb({ msg: "이미지만 업로드 가능합니다." }, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "img"
);

//=================================
//            editorImage
//=================================

router.post("/uploadfiles", upload, (req, res) => {
  //비디오를 서버에 저장
  console.log("전달받은 파일", req.file);
  console.log("저장된 파일의 이름", req.file.filename);

  const IMG_URL = `http://${req.hostname}:4000/uploads/board/${req.file.filename}`;

  res.json({ url: IMG_URL });
});

module.exports = router;
