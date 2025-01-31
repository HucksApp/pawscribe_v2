import React from "react";
import { Menu, Dropdown } from "antd";
import PropTypes from "prop-types";

const ContextMenu = ({ options, onSelect }) => {
  const menu = (
    <Menu
      onClick={({ key }) => onSelect(key)}
      items={options.map((option) => ({ key: option.key, label: option.label }))}
    />
  );

  return <Dropdown overlay={menu} trigger={["contextMenu"]}></Dropdown>;
};

ContextMenu.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default ContextMenu;
