import React from "react";
import { Modal } from "antd";

const FileViewer = ({ visible, file, onClose }) => {
  if (!file) return null;

  return (
    <Modal title={file.name} visible={visible} footer={null} onCancel={onClose} width={800}>
      {file.type.startsWith("image/") ? (
        <img src={file.url} alt={file.name} style={{ width: "100%" }} />
      ) : file.type === "application/pdf" ? (
        <embed src={file.url} type="application/pdf" style={{ width: "100%", height: "600px" }} />
      ) : (
        <pre>{file.content}</pre>
      )}
    </Modal>
  );
};

export default FileViewer;
