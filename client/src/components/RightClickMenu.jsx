import React from "react";
import { Menu, Dropdown } from "antd";

const RightClickMenu = ({ type, onRename, onDelete, onAddFile, onAddFolder, onCopy, position }) => {
  const menuItems = type === "file"
    ? [
        { key: "open", label: "Open" },
        { key: "rename", label: "Rename" },
        { key: "delete", label: "Delete" },
        { key: "copy", label: "Copy" },
      ]
    : [
        { key: "addFile", label: "Add File" },
        { key: "addFolder", label: "Add Folder" },
        { key: "rename", label: "Rename" },
        { key: "delete", label: "Delete" },
      ];

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "rename":
        onRename();
        break;
      case "delete":
        onDelete();
        break;
      case "addFile":
        onAddFile();
        break;
      case "addFolder":
        onAddFolder();
        break;
      case "copy":
        onCopy();
        break;
      default:
        break;
    }
  };

  return (
    <Dropdown
      overlay={<Menu onClick={handleMenuClick} items={menuItems} />}
      trigger={["contextMenu"]}
      placement="bottomLeft"
      style={{ top: position.top, left: position.left }}
    >
      <div />
    </Dropdown>
  );
};

export default RightClickMenu;
