const express = require("express");
const router = express.Router();
const { Chat, ChatRoom } = require("../models/Chat");
//=================================
//           chat
//=================================

router.post("/chatList", (req, res) => {
  //글 목록 불러오기
  Chat.find({ room: req.body.room })
    .populate("writer")
    .exec((err, chat) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({ success: true, chat });
    });
});

router.post("/myChatRoomList", (req, res) => {
  //글 목록 불러오기
  ChatRoom.find({ user: req.body.userId })
    .populate("user")
    .populate("room")
    .exec((err, chatRoom) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({ success: true, chatRoom });
    });
});

router.post("/chatRoomRemove", (req, res) => {
  //글 목록 불러오기
  console.log(req.body);

  ChatRoom.findOneAndDelete({ room: req.body.room, user: req.body.user }).exec(
    (err, chatRoom) => {
      if (err) return res.status(400).send(err);

      res.status(200).json({ success: true, chatRoom });
    }
  );
});

module.exports = router;
