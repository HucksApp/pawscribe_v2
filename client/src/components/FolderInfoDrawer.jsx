import React from "react";
import { Drawer, Descriptions } from "antd";

const FolderInfoDrawer = ({ visible, folder, onClose }) => {
  if (!folder) return null;

  return (
    <Drawer
      title="Folder Info"
      placement="right"
      onClose={onClose}
      visible={visible}
      width={400}
    >
      <Descriptions bordered>
        <Descriptions.Item label="Name">{folder.name}</Descriptions.Item>
        <Descriptions.Item label="Size">{folder.size}</Descriptions.Item>
        <Descriptions.Item label="Last Modified">
          {folder.lastModified}
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
};

export default FolderInfoDrawer;
