import React, { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "./BoardListPage.css";

function BoardListPage() {
  const [BoardList, setBoardList] = useState([]);

  const userId = localStorage.getItem("userId");

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

  const DeleteHandler = (e) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="custom-ui">
            <h1>글을 삭제하시겠습니까?</h1>
            <p>지우신 글은 다시 복구가 불가능합니다.</p>

            <button
              onClick={() => {
                const data = {
                  boardId: e.target.dataset.boardid,
                };
                axios
                  .post(
                    process.env.REACT_APP_DB_HOST + "/api/board/deleteBoard",
                    data
                  )
                  .then((response) => {
                    if (response.data.success) {
                      setBoardList(response.data.board);
                    } else {
                      alert("글 삭제 실패");
                    }
                  });
                onClose();
              }}
            >
              삭제하기
            </button>
            <button onClick={onClose}>취소</button>
          </div>
        );
      },
    });
  };

  const render = BoardList.map((board, index) => {
    const text = board.description
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/&quot;/g, "")
      .replace(/"n/, "")
      .replace(/&amp;/g, "");
    return (
      <List.Item key={index}>
        <List.Item.Meta
          avatar={
            <Avatar
              src={
                board.writer.image
                  ? `${process.env.REACT_APP_SERVER_HOST}/${board.writer.image}`
                  : ""
              }
            />
          }
          title={<Link to={`/board/view/${board._id}`}>{board.title}</Link>}
          description={text}
        />
        {userId === board.writer._id && (
          <div>
            <span>수정</span>
            <span onClick={DeleteHandler} data-boardid={board._id}>
              삭제
            </span>
          </div>
        )}
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
        <List itemLayout="horizontal">{BoardList && render}</List>
      </div>
    </div>
  );
}

export default BoardListPage;
