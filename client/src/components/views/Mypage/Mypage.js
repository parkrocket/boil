import axios from "axios";
import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";

function Mypage() {
  const user = useSelector((state) => state.user);
  const [ProfileImagePath, setProfileImagePath] = useState(user.userData.image);
  const [NickName, setNickName] = useState(user.userData.name);
  const [FilePath, setFilePath] = useState("");

  const navigate = useNavigate();

  //닉네임 핸들러
  const onNamaHandler = (e) => {
    setNickName(e.currentTarget.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const data = {
      userId: user.userData._id,
      name: NickName,
      profileImagePath: ProfileImagePath,
      filePath: FilePath,
    };

    axios
      .post(`${process.env.REACT_APP_DB_HOST}/api/users/updateUser`, data)
      .then((response) => {
        if (response.data.success) {
          navigate("/");
        } else {
          alert("서브밋 실패!");
        }
      });
  };

  //파일업로드
  const onDrop = (files) => {
    let formData = new FormData();
    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios
      .post(
        `${process.env.REACT_APP_DB_HOST}/api/users/uploadProfile`,
        formData,
        config
      )
      .then((response) => {
        if (response.data.success) {
          console.log(response.data);

          setFilePath(response.data.url);
          setProfileImagePath(response.data.thumbnailPath);
        } else {
          alert("프로필 이미지 업로드 실패!");
        }
      });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmit}
      >
        <label>닉네임</label>
        <input onChange={onNamaHandler} value={NickName}></input>
        <label>프로필이미지</label>
        <div style={{ position: "relative" }}>
          <Dropzone onDrop={onDrop} multiple={false} maxSize={10000000}>
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
                {ProfileImagePath && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                    }}
                  >
                    <img
                      src={`${process.env.REACT_APP_SERVER_HOST}/${ProfileImagePath}`}
                      alt="thumbnail"
                      style={{ width: "100%" }}
                    />
                  </div>
                )}
              </div>
            )}
          </Dropzone>
        </div>

        <button onSubmit={onSubmit}>정보수정</button>
      </form>
    </div>
  );
}

export default Mypage;
