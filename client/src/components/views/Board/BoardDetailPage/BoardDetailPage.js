import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function BoardDetailPage() {
  const boardId = useParams().boardId;
  const data = { boardId: boardId };
  const [BoardDetail, setBoardDetail] = useState([]);

  useEffect(() => {
    axios.post("/api/board/getBoardDetail", data).then((response) => {
      if (response.data.success) {
        setBoardDetail(response.data.board);
      } else {
        alert("게시글 로딩 실패");
      }
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "70%", marginTop: "30px" }}>
        <div
          dangerouslySetInnerHTML={{ __html: BoardDetail.description }}
        ></div>
      </div>
    </div>
  );
}

export default BoardDetailPage;
