import React, { useEffect, useState } from "react";
import SingleComment from "./SingleComment";

function ReplyComment(props) {
  const [CommentNumber, setCommentNumber] = useState(0);
  const [OpenComment, setOpenComment] = useState(true);

  useEffect(() => {
    let commentNumber = 0;

    props.commentList.map((comment, index) => {
      if (comment.responseTo === props.parentCommentId) {
        commentNumber++;
      }
    });

    setCommentNumber(commentNumber);
  }, [props.commentList, props.parentCommentId]);

  const renderReplyComment = (parentCommentId) => {
    return props.commentList.map((comment, index) => (
      <React.Fragment key={index}>
        {comment.responseTo === parentCommentId && (
          <div style={{ width: "80%", marginLeft: "40px" }}>
            <SingleComment
              key={index}
              comment={comment}
              refreshComment={props.refreshComment}
              openCommentNumber={props.openCommentNumber}
              openCommentNumberChange={props.openCommentNumberChange}
            ></SingleComment>
            <ReplyComment
              parentCommentId={comment._id}
              commentList={props.commentList}
              refreshComment={props.refreshComment}
              openCommentNumber={props.openCommentNumber}
              openCommentNumberChange={props.openCommentNumberChange}
            ></ReplyComment>
          </div>
        )}
      </React.Fragment>
    ));
  };
  const onViewHandler = () => {
    setOpenComment(!OpenComment);
  };
  return (
    <div>
      {CommentNumber > 0 && (
        <p
          style={{ fontSize: "14px", margin: 0, color: "gray" }}
          onClick={onViewHandler}
        >
          View {CommentNumber} more comments
        </p>
      )}
      {OpenComment && renderReplyComment(props.parentCommentId)}
    </div>
  );
}

export default ReplyComment;
