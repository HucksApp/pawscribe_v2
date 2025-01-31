import React from "react";
import { Drawer, Descriptions } from "antd";

const FileInfoDrawer = ({ visible, file, onClose }) => {
  if (!file) return null;

  return (
    <Drawer style={{color:"var( --text-secondary)"}} title="File Info" placement="right" onClose={onClose} visible={visible} width={400}>
      <Descriptions bordered>
        <Descriptions.Item label="Name">{file.name}</Descriptions.Item>
        <Descriptions.Item label="Type">{file.type}</Descriptions.Item>
        <Descriptions.Item label="Size">{file.size} bytes</Descriptions.Item>
        <Descriptions.Item label="Last Modified">{file.lastModified}</Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default FileInfoDrawer;
