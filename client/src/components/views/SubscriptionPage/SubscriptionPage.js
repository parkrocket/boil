import React, { useEffect, useState } from "react";
import { Card, Avatar, Col, Typography, Row } from "antd";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
  const [Video, setVideo] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const subscriptionVariable = {
      userFrom: userId,
    };
    axios
      .post(
        `${process.env.REACT_APP_DB_HOST}/api/video/getSubscriptionVideos`,
        subscriptionVariable
      )
      .then((response) => {
        if (response.data.success) {
          setVideo(response.data.videos);
        } else {
          alert("비디오 리스트 로딩 실패");
        }
      });
  }, [userId]);

  const renderCards = Video.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <Link to={`/video/${video._id}`}>
          <div style={{ position: "relative" }}>
            <img
              style={{ width: "100%" }}
              src={`${process.env.REACT_APP_SERVER_HOST}/${video.thumbnail}`}
              alt="thumbnail"
            />
            <div className="duration">
              <span>
                {minutes} : {seconds}
              </span>
            </div>
          </div>
        </Link>
        <div>
          <span style={{ marginLeft: "3ren", float: "left" }}>
            {video.views} views{" "}
          </span>{" "}
          - <span>{moment(video.createdAt).format("YYYY MM DD HH:mm:ss")}</span>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={video.writer.image}></Avatar>}
          title={video.title}
          description=""
        ></Meta>
        <span>{video.writer.name}</span>
      </Col>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <Title level={2}> Subscription</Title>
      <hr />
      <Row gutter={[32, 16]}>{renderCards}</Row>
    </div>
  );
}

export default SubscriptionPage;
