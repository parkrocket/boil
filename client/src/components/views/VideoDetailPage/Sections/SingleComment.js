import React, { useState } from "react";
import { Comment, Avatar } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import LikeDislikes from "./LikeDislikes";

function SingleComment(props) {
  const [OpenReply, setOpenReply] = useState(false);
  const [Text, setText] = useState("");

  const user = useSelector((state) => state.user);
  const video = useParams();

  const onClickReplyOpen = () => {
    props.openCommentNumberChange(props.comment._id);

    if (props.comment._id === props.openCommentNumber) {
      console.log("같음");
      setOpenReply(!OpenReply);
    } else {
      setOpenReply(true);
    }

    //
  };

  const actions = [
    <LikeDislikes commentId={props.comment._id}></LikeDislikes>,
    <span onClick={onClickReplyOpen} key="comment-basic-reply-to">
      Reply to
    </span>,
  ];

  const textChangeHandler = (e) => {
    setText(e.currentTarget.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    const data = {
      content: Text,
      writer: user.userData._id,
      responseTo: props.comment._id,
      postId: video.videoId,
    };

    axios.post("/api/comment/saveComment", data).then((response) => {
      if (response.data.success) {
        setText("");
        props.refreshComment(response.data.result);
        setOpenReply(!OpenReply);
      } else {
        alert("대댓글 실패!");
      }
    });
  };

  return (
    <div>
      <Comment
        actions={actions}
        author={props.comment.writer.name}
        avatar={
          <Avatar
            src={`http://localhost:5000/${props.comment.writer.image}`}
            alt
          />
        }
        content={<p>{props.comment.content}</p>}
      />
      {OpenReply && props.comment._id === props.openCommentNumber && (
        <form style={{ display: "flex" }} onSubmit={onSubmitHandler}>
          <textarea
            style={{ width: "100%", borderRadius: "5px" }}
            onChange={textChangeHandler}
            value={Text}
            placeholder="코멘트를 작성해주세요"
          ></textarea>
          <br></br>
          <button
            style={{ width: "20%", height: "52px" }}
            onClick={onSubmitHandler}
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default SingleComment;
