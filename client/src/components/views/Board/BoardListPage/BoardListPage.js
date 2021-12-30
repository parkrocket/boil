import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

function BoardListPage() {
  const [BoardList, setBoardList] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_DB_HOST + "/api/board/getBoardList")
      .then((response) => {
        if (response.data.success) {
          setBoardList(response.data.board);
        } else {
          alert("글 리스트 로딩 실패");
        }
      });
  }, []);
  const render = BoardList.map((board, index) => {
    const text = board.description
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/&quot;/g, "")
      .replace(/"n/, "")
      .replace(/&amp;/g, "");
    return (
      <List.Item key={index}>
        <List.Item.Meta
          avatar={<Avatar src={board.writer.image ? board.writer.image : ""} />}
          title={<Link to={`/board/view/${board._id}`}>{board.title}</Link>}
          description={text}
        />
      </List.Item>
    );
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "70%", marginTop: "50px" }}>
        <List itemLayout="horizontal">{render}</List>
      </div>
    </div>
  );
}

export default BoardListPage;
