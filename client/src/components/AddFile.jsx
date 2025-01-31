import React, { useState } from "react";
import { Modal, Upload, Button, message } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import '../css/addFile.css'

const AddFile = ({ isVisible, onClose }) => {
  const [fileList, setFileList] = useState([]);

  // Handle file upload
  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle modal submission
  const handleOk = () => {
    if (fileList.length === 0) {
      message.warning("Please upload at least one file.");
      return;
    }
    message.success(`${fileList.length} file(s) uploaded successfully.`);
    onClose(); // Close modal
    setFileList([]); // Reset file list
  };

  return (
    <Modal
      title="Add New File"
      className="addFile-modal"
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Upload"
      cancelText="Cancel"
    >
      <Upload.Dragger
        multiple
        fileList={fileList}
        onChange={handleFileChange}
        beforeUpload={() => false} // Prevent automatic upload
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Drag files here or click to upload</p>
        <p className="ant-upload-hint">
          Supports single or multiple file uploads.
        </p>
      </Upload.Dragger>
      <div style={{ marginTop: 16 }}>
        <Upload
          multiple
          fileList={fileList}
          onChange={handleFileChange}
          beforeUpload={() => false} // Prevent automatic upload
        >
          <Button type="default" icon={<UploadOutlined />}>Select Files</Button>
        </Upload>
      </div>
    </Modal>
  );
};

export default AddFile;
