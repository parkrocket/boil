import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
  const user = useSelector((state) => state.user);
  const video = useParams();

  const [Text, setText] = useState("");
  const [OpenReplyCommentNumber, setOpenReplyCommentNumber] = useState();

  const textHandler = (e) => {
    setText(e.currentTarget.value);
  };

  const openCommentNumberChange = (setting) => {
    setOpenReplyCommentNumber(setting);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = {
      content: Text,
      writer: user.userData._id,
      postId: video.videoId,
    };

    axios
      .post(`${process.env.REACT_APP_DB_HOST}/api/comment/saveComment`, data)
      .then((response) => {
        if (response.data.success) {
          setText("");
          props.refreshComment(response.data.result);
        } else {
          alert("코멘트 작성 실패");
        }
      });
  };

  return (
    <div>
      <br></br>
      <p> Replies</p>
      <hr />
      {/* Comment List*/}

      {props.commentList &&
        props.commentList.map((comment, index) => {
          if (!comment.responseTo) {
            return (
              <React.Fragment key={index}>
                <SingleComment
                  key={index}
                  comment={comment}
                  refreshComment={props.refreshComment}
                  openCommentNumber={OpenReplyCommentNumber}
                  openCommentNumberChange={openCommentNumberChange}
                ></SingleComment>
                <ReplyComment
                  parentCommentId={comment._id}
                  commentList={props.commentList}
                  refreshComment={props.refreshComment}
                  openCommentNumber={OpenReplyCommentNumber}
                  openCommentNumberChange={openCommentNumberChange}
                ></ReplyComment>
              </React.Fragment>
            );
          } else {
            return "";
          }
        })}

      {/* Root Comment Form*/}
      <form style={{ display: "flex" }} onSubmit={onSubmit}>
        <textarea
          style={{ width: "100%", borderRadius: "5px" }}
          onChange={textHandler}
          value={Text}
          placeholder="코멘트를 작성해주세요"
        ></textarea>
        <br></br>
        <button style={{ width: "20%", height: "52px" }} onClick={onSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Comment;
