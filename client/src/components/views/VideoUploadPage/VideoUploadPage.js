import React from "react";
import Dropzone from "react-dropzone";
import { Typography, Button, Form, message, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { TextArea } = Input;
const { Title } = Typography;

function VideoUploadPage() {
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>VideoUpload</Title>
      </div>
      <Form onSubmit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* 드랍존 */}
          <Dropzone onDrop multiple maxSize>
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
          <div>
            <img src alt />
          </div>
        </div>

        <br></br>
        <br></br>
        <label>Title</label>
        <Input onChange value></Input>
        <br></br>
        <br></br>
        <label>Description</label>
        <TextArea onChange value></TextArea>
        <br></br>
        <br></br>
        <select onChange>
          <option value></option>
        </select>
        <br></br>
        <br></br>
        <select onChange>
          <option value></option>
        </select>
        <br></br>
        <br></br>
        <Button type="primary" size="large" onClick>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default VideoUploadPage;
