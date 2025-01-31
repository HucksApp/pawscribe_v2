import React from "react";
import { Menu } from "antd";
import PropTypes from "prop-types";

const TreeContextMenu = ({ x, y, node, onClose }) => {
  const isFolder = !node.isLeaf;

  const handleMenuClick = (action) => {
    console.log(`Action: ${action}, Node: ${node.title}`);
    onClose();
  };

  const menuItems = isFolder
    ? [
        { key: "addFile", label: "Add File" },
        { key: "addFolder", label: "Add Folder" },
        { key: "rename", label: "Rename" },
        { key: "delete", label: "Delete" },
      ]
    : [
        { key: "open", label: "Open" },
        { key: "rename", label: "Rename" },
        { key: "delete", label: "Delete" },
        { key: "copy", label: "Copy" },
      ];

  return (
    <Menu
      style={{
        position: "absolute",
        top: y,
        left: x,
        zIndex: 1000,
      }}
      onClick={({ key }) => handleMenuClick(key)}
      items={menuItems}
    />
  );
};

TreeContextMenu.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  node: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TreeContextMenu;
