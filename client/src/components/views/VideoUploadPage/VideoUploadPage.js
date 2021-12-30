import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOption = [
  {
    value: 0,
    label: "Private",
  },
  {
    value: 1,
    label: "Public",
  },
];

const CategoryOption = [
  { value: 0, label: "Film & Animation" },
  { value: 1, label: "Autos & Vehicles" },
  { value: 2, label: "Music" },
  { value: 3, label: "Pets & Animals" },
];

function VideoUploadPage() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [VideoTitle, setVideoTitle] = useState("");
  const [Description, setDescription] = useState("");
  const [Private, setPrivate] = useState(0);
  const [Category, setCategory] = useState("Film & Animation");
  const [FilePath, setFilePath] = useState("");
  const [Duration, setDuration] = useState("");
  const [ThumbnailPath, seThumbnailPath] = useState("");

  const onTitleChange = (e) => {
    setVideoTitle(e.currentTarget.value);
  };

  const onDescriptionChange = (e) => {
    setDescription(e.currentTarget.value);
  };

  const onPrivateChange = (e) => {
    setPrivate(e.currentTarget.value);
  };

  const onCategoryChange = (e) => {
    setCategory(e.currentTarget.value);
  };

  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    console.log(files);
    axios
      .post(
        `${process.env.REACT_APP_DB_HOST}/api/video/uploadfiles`,
        formData,
        config
      )
      .then((response) => {
        if (response.data.success) {
          let variable = {
            url: response.data.url,
            fileName: response.data.fileName,
          };

          setFilePath(response.data.url);

          axios
            .post(
              `${process.env.REACT_APP_DB_HOST}/api/video/thumbnail`,
              variable
            )
            .then((response) => {
              if (response.data.success) {
                setDuration(response.data.fileDuration);
                seThumbnailPath(response.data.url);
              } else {
                alert("썸네일 생성 실패");
              }
            });
        } else {
          alert("비디오 업로드 실패!");
        }
      });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const variables = {
      writer: user.userData._id,
      title: VideoTitle,
      description: Description,
      privacy: Private,
      filePath: FilePath,
      category: Category,
      duration: Duration,
      thumbnail: ThumbnailPath,
    };

    axios
      .post(`${process.env.REACT_APP_DB_HOST}/api/video/uploadVideo`, variables)
      .then((response) => {
        if (response.data.success) {
          message.success("업로드를 성공했습니다.");

          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          alert("비디오 업로드에 실패했습니다.");
        }
      });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>글쓰기</Title>
      </div>
      <Form onSubmit={onSubmit}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 드랍존 */}
          <Dropzone onDrop={onDrop} multiple={false} maxSize={100000000}>
            {({ getRootProps, getInputProps }) => (
              <div
                style={{
                  width: "300px",
                  height: "240px",
                  border: "1px solid lightgray",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                <PlusOutlined style={{ fontSize: "3rem" }} />
              </div>
            )}
          </Dropzone>
          {/* 썸네일 */}
          {ThumbnailPath && (
            <div>
              <img
                src={`${process.env.REACT_APP_SERVER_HOST}/${ThumbnailPath}`}
                alt="thumbnail"
              />
            </div>
          )}
        </div>

        <br></br>
        <br></br>
        <label>Title</label>
        <Input onChange={onTitleChange} value={VideoTitle}></Input>
        <br></br>
        <br></br>
        <label>Description</label>
        <TextArea onChange={onDescriptionChange} value={Description}></TextArea>
        <br></br>
        <br></br>
        <select onChange={onPrivateChange}>
          {PrivateOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br></br>
        <br></br>
        <select onChange={onCategoryChange}>
          {CategoryOption.map((item, index) => (
            <option key={index} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <br></br>
        <br></br>
        <Button type="primary" size="large" onClick={onSubmit}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
