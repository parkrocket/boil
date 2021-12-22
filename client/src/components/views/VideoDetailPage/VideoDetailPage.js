import React, { useState, useEffect } from "react";
import { Row, Col, List, Avatar } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";

const VideoDetailPage = (props) => {
  const videoId = useParams().videoId;
  const variable = { videoId: videoId };
  const [VideoDetail, setVideoDetail] = useState([]);

  useEffect(() => {
    axios.post("/api/video/getVideoDetail", variable).then((response) => {
      if (response.data.success) {
        console.log(response.data.videoDetail);
        setVideoDetail(response.data.videoDetail);
      } else {
        alert("비디오 로딩 실패");
      }
    });
  }, []);

  if (VideoDetail.writer) {
    return (
      <Row gutter={[16, 16]}>
        <Col lg={18} xs={24}>
          <div style={{ width: "100%", padding: "3rem 4rem" }}>
            <video
              style={{ width: "100%", maxHeight: "600px" }}
              src={`http://localhost:5000/${VideoDetail.filePath}`}
              controls
            ></video>

            <List.Item actions>
              <List.Item.Meta
                avatar={<Avatar src={VideoDetail.writer.image}></Avatar>}
                title={VideoDetail.writer.name}
                description={VideoDetail.description}
              ></List.Item.Meta>
            </List.Item>
          </div>
        </Col>
        ;<Col lg={6} xs={24}></Col>
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
