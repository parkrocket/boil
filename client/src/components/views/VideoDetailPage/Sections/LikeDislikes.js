import React, { useEffect, useState } from "react";
import { Tooltip } from "antd";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  LikeOutlined,
  DislikeOutlined,
  LikeFilled,
  DislikeFilled,
} from "@ant-design/icons";
import axios from "axios";

function LikeDislikes(props) {
  let data = {};
  const videoUrl = useParams();
  const user = useSelector((state) => state.user);

  const [Likes, setLikes] = useState(0);
  const [DisLikes, setDisLikes] = useState(0);
  const [LikeAction, setLikeAction] = useState(null);
  const [DisLikeAction, setDisLikeAction] = useState(null);

  if (props.video) {
    data = {
      videoId: videoUrl.videoId,
      userId: user.userData._id,
    };
  } else {
    data = {
      commentId: props.commentId,
      userId: user.userData._id,
    };
  }

  useEffect(() => {
    axios.post("/api/like/getLikes", data).then((response) => {
      if (response.data.success) {
        setLikes(response.data.likes.length);
        if (response.data.myLikes.length) {
          setLikeAction("liked");
        } else {
          setLikeAction(null);
        }
      } else {
        alert("좋아요 데이터 가져오기 오류");
      }
    });
    axios.post("/api/like/getDisLikes", data).then((response) => {
      if (response.data.success) {
        setDisLikes(response.data.dislikes.length);
        if (response.data.myDisLikes.length) {
          setDisLikeAction("disliked");
        } else {
          setDisLikeAction(null);
        }
      } else {
        alert("싫어요 데이터 가져오기 오류");
      }
    });
  }, [data, user]);

  const onLike = () => {
    if (LikeAction === null) {
      axios.post("/api/like/upLike", data).then((response) => {
        if (response.data.success) {
          setLikes(Likes + 1);
          setLikeAction("liked");
          if (DisLikeAction !== null) {
            setDisLikes(DisLikes - 1);
            setDisLikeAction(null);
          }
        } else {
          alert("좋아요 실패");
        }
      });
    } else {
      axios.post("/api/like/unLike", data).then((response) => {
        if (response.data.success) {
          setLikes(Likes - 1);
          setLikeAction(null);
        } else {
          alert("좋아요 취소 실패");
        }
      });
    }
  };

  const onDisLike = () => {
    if (DisLikeAction === null) {
      axios.post("/api/like/upDisLike", data).then((response) => {
        if (response.data.success) {
          console.log(response.data);
          setDisLikes(DisLikes + 1);
          setDisLikeAction("disliked");
          if (LikeAction !== null) {
            setLikes(Likes - 1);
            setLikeAction(null);
          }
        } else {
          alert("싫어요 실패");
        }
      });
    } else {
      axios.post("/api/like/unDisLike", data).then((response) => {
        if (response.data.success) {
          setDisLikes(DisLikes - 1);
          setDisLikeAction(null);
        } else {
          alert("싫어요 취소 실패");
        }
      });
    }
  };

  return (
    <div>
      <span key="comment-basic-like">
        <Tooltip title="Like">
          {LikeAction === "liked" ? (
            <LikeFilled onClick={onLike} />
          ) : (
            <LikeOutlined onClick={onLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {Likes} </span>
      </span>

      <span key="comment-basic-dislike">
        <Tooltip title="Disike">
          {DisLikeAction === "disliked" ? (
            <DislikeFilled onClick={onDisLike} />
          ) : (
            <DislikeOutlined onClick={onDisLike} />
          )}
        </Tooltip>
        <span style={{ paddingLeft: "8px", cursor: "auto" }}> {DisLikes} </span>
      </span>
    </div>
  );
}

export default LikeDislikes;
