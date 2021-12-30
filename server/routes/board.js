const express = require("express");
const router = express.Router();
const { Board } = require("../models/Board");
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
  console.log(file.mimetype);
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/gif"
  ) {
    cb(null, true);
  } else {
    cb({ msg: "mp4 파일만 업로드 가능합니다." }, false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter }).single(
  "file"
);

//=================================
//             Board
//=================================

router.post("/uploadBoard", (req, res) => {
  //글을 저장한다.
  const board = new Board(req.body);
  board.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    res.status(200).json({ success: true, doc });
  });
});

router.get("/getBoardList", (req, res) => {
  console.log("asdf");
  //글 목록 불러오기
  Board.find()
    .populate("writer")
    .exec((err, board) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({ success: true, board });
    });
});

router.post("/getBoardDetail", (req, res) => {
  //글 상세 불러오기

  Board.findOne({ _id: req.body.boardId })
    .populate("writer")
    .exec((err, board) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({ success: true, board });
    });
});

module.exports = router;
