import React, { Children, useState } from "react";
import { Input, Tooltip } from "antd";
import {
  SearchOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  EyeInvisibleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import Logo from "./Logo";
import '../css/headbar.css';

const HeadBar = ({ collapsed, setCollapsed, isMenuHidden, setMenuHidden, setSearchValue, propsButtons, children }) => {
  return (
    <div className="headbar">
      <div className="headbar-container">
        <Tooltip  title={isMenuHidden ? "Show Menu" : "Hide Menu"}>
      < button className="icon-button"
          onClick={() => setMenuHidden(!isMenuHidden)}
        >
          {isMenuHidden ? <RightCircleOutlined className="button-icon" /> :  <LeftCircleOutlined className="button-icon" />}
        </button>
        </Tooltip >
        {/* Toggle Menu Collapse */}
        <Tooltip  title={collapsed ? "Expand Menu" : "Collapse Menu"}>
        <button  className={`icon-button ${isMenuHidden? 'hidden': ''}`} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <MenuUnfoldOutlined className="button-icon" /> : <MenuFoldOutlined  className="button-icon"  />}
        </button>
        </Tooltip>

        <div className="logo-cover">
          <Logo />
        </div>
        </div>


        <div className="search-container">
          <div className="pros-buttons">
        
          {
          propsButtons.map((button, index) => (
            <div key={index} className="pros-button-item">
              {button}
            </div>
            ))
          }

            {children}
          </div>
          <Input
            prefix={<SearchOutlined className="button-icon" />}
            placeholder="Search..."
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
            className="search-input"
          />
        </div>
    </div>
  );
};

HeadBar.propTypes = {
  setSearchValue: PropTypes.func.isRequired,
  isMenuHidden: PropTypes.bool.isRequired,
  setMenuHidden: PropTypes.func.isRequired,
};

export default HeadBar;
