import React, { useState, useEffect } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideVideo from "./Sections/SideVideo";
import Subscribe from "./Sections/Subscribe";
import Comment from "./Sections/Comment";
import LikeDislikes from "./Sections/LikeDislikes";

const VideoDetailPage = (props) => {
  const videoId = useParams().videoId;

  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);
  const [Comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_DB_HOST}/api/video/getVideoDetail`,
        variable
      )
      .then(
        (response) => {
          if (response.data.success) {
            setVideoDetail(response.data.videoDetail);
          } else {
            alert("비디오 로딩 실패");
          }
        },
        [videoId]
      );

    axios
      .post(
        `${process.env.REACT_APP_DB_HOST}/api/comment/getComments`,
        variable
      )
      .then((response) => {
        if (response.data.success) {
          setComments(response.data.comments);
        } else {
          alert("비디오 로딩 실패");
        }
      });
  }, [videoId]);

  const refreshComment = (newComment) => {
    setComments(Comments.concat(newComment));
  };

  if (VideoDetail.writer) {
    const subscribeButton = VideoDetail.writer._id !==
      localStorage.getItem("userId") && (
      <Subscribe
        userTo={VideoDetail.writer._id}
        userFrom={localStorage.getItem("userId")}
      ></Subscribe>
    );

    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%", maxHeight: "600px" }}
              src={`${process.env.REACT_APP_SERVER_HOST}/${VideoDetail.filePath}`}
              controls
            ></video>

            <List.Item
              actions={[<LikeDislikes video></LikeDislikes>, subscribeButton]}
            >
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image}></Avatar>}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>
            <Comment
              commentList={Comments}
              refreshComment={refreshComment}
            ></Comment>
          </div>
        </Col>
        <Col lg={6} xs={24}>
          <SideVideo videoId={videoId}></SideVideo>
        </Col>
      </Row>
    );
  } else {
    return (
      <div>
        <h1>...Loading</h1>
      </div>
    );
  }
};

export default VideoDetailPage;
