import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Comment from "./Sections/Comment";

function BoardDetailPage() {
  const boardId = useParams().boardId;
  const data = { boardId: boardId };
  const [BoardDetail, setBoardDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .post(process.env.REACT_APP_DB_HOST + "/api/board/getBoardDetail", data)
      .then((response) => {
        if (response.data.success) {
          setBoardDetail(response.data.board);
        } else {
          alert("게시글 로딩 실패");
        }
      });

    axios
      .post(`${process.env.REACT_APP_DB_HOST}/api/comment/getComments`, data)
      .then((response) => {
        console.log(data);
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          alert("게시글 코멘트 로드 실패");
        }
      });
  }, []);

  const refreshComment = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <div style={{ width: "70%", marginTop: "30px" }}>
          <div
            dangerouslySetInnerHTML={{ __html: BoardDetail.description }}
          ></div>
        </div>
        <div>
          <Comment
            commentList={Comments}
            refreshComment={refreshComment}
          ></Comment>
        </div>
      </div>
    </div>
  );
}

export default BoardDetailPage;
