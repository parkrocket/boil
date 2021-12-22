import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function SideVideo() {
  const [SideVideos, setSideVideos] = useState([]);

  useEffect(() => {
    axios.get("/api/video/getVideos").then((response) => {
      if (response.data.success) {
        setSideVideos(response.data.videos);
      } else {
        alert("비디오 리스트 로딩 실패");
      }
    });
  }, []);

  const renderSideVideo = SideVideos.map((video, index) => {
    const minutes = Math.floor(video.duration / 60);
    const seconds = Math.floor(video.duration - minutes * 60);

    return (
      <div
        key={index}
        style={{ display: "flex", marginBottom: "1rem", padding: "0 2rem" }}
      >
        <div style={{ width: "40%", marginRight: "1rem" }}>
          <Link to={`/video/${video._id}`}>
            <img
              style={{ width: "100%", height: "100%" }}
              src={`http://localhost:5000/${video.thumbnail}`}
              alt="thumbnail"
            ></img>
          </Link>
        </div>
        <div style={{ width: "50%" }}>
          <Link to={`/video/${video._id}`} style={{ color: "grey" }}>
            <span style={{ fontSize: "1rem", color: "black" }}>
              {video.title}
            </span>
            <br></br>
            <span>{video.writer.name}</span>
            <br></br>
            <span>{video.views}</span>
            <br></br>
            <span>
              {minutes} : {seconds}
            </span>
          </Link>
        </div>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div style={{ marginTop: "3rem" }}>{renderSideVideo}</div>
    </React.Fragment>
  );
}

export default SideVideo;
