const express = require("express");
const router = express.Router();
const { Like } = require("../models/Like");
const { Dislike } = require("../models/Dislike");

//=================================
//             LikeDislike
//=================================

router.post("/getLikes", (req, res) => {
  //좋아요 가져오기
  let data = {};
  if (req.body.videoId) {
    data = { videoId: req.body.videoId };
  } else {
    data = { commentId: req.body.commentId };
  }

  let myData = {};
  if (req.body.videoId) {
    myData = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    myData = { commentId: req.body.commentId, userId: req.body.userId };
  }
  Like.find(data).exec((err, likes) => {
    if (err) return res.status(400), send(err);

    Like.find(myData).exec((err, myLikes) => {
      if (err) return res.status(400), send(err);
      res.status(200).json({ success: true, likes, myLikes });
    });
  });
});

router.post("/getDisLikes", (req, res) => {
  //싫어요 가져오기
  let data = {};
  if (req.body.videoId) {
    data = { videoId: req.body.videoId };
  } else {
    data = { commentId: req.body.commentId };
  }

  let myData = {};
  if (req.body.videoId) {
    myData = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    myData = { commentId: req.body.commentId, userId: req.body.userId };
  }
  Dislike.find(data).exec((err, dislikes) => {
    if (err) return res.status(400), send(err);
    Dislike.find(myData).exec((err, myDisLikes) => {
      if (err) return res.status(400), send(err);
      res.status(200).json({ success: true, dislikes, myDisLikes });
    });
  });
});

router.post("/upLike", (req, res) => {
  let data = {};
  if (req.body.videoId) {
    data = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    data = { commentId: req.body.commentId, userId: req.body.userId };
  }
  console.log(data);
  const like = new Like(data);

  like.save((err, likeResult) => {
    if (err) return res.status(400), send(err);

    Dislike.findOneAndDelete(data).exec((err, disLikeResult) => {
      if (err) return res.status(400), send(err);
      res.status(200).json({ success: true, disLikeResult });
    });
  });
});

router.post("/unLike", (req, res) => {
  let data = {};
  if (req.body.videoId) {
    data = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    data = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Like.findOneAndDelete(data).exec((err, unLikeResult) => {
    if (err) return res.status(400), send(err);
    res.status(200).json({ success: true, unLikeResult });
  });
});

router.post("/upDisLike", (req, res) => {
  let data = {};
  if (req.body.videoId) {
    data = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    data = { commentId: req.body.commentId, userId: req.body.userId };
  }

  const dislike = new Dislike(data);

  dislike.save((err, dislikeResult) => {
    if (err) return res.status(400), send(err);
    Like.findOneAndDelete(data).exec((err, DisLikeResult) => {
      if (err) return res.status(400), send(err);
      res.status(200).json({ success: true, DisLikeResult });
    });
  });
});

router.post("/unDisLike", (req, res) => {
  let data = {};
  if (req.body.videoId) {
    data = { videoId: req.body.videoId, userId: req.body.userId };
  } else {
    data = { commentId: req.body.commentId, userId: req.body.userId };
  }

  Dislike.findOneAndDelete(data).exec((err, unDisLikeResult) => {
    if (err) return res.status(400), send(err);
    res.status(200).json({ success: true, unDisLikeResult });
  });
});

module.exports = router;
