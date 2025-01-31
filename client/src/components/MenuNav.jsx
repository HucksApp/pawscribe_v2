import React from "react";
import {
  AppstoreOutlined,
  UserOutlined,
  FileOutlined,
  FolderOutlined,
  CodeOutlined,
  FormOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Notify from "../services/notification";
import "../css/menucolumn.css";

const base = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.getItem("jwt_token");

const MenuComponent = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${base}/Api/v1/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/");
      Notify({ message: response.data.message, type: "success" });
      localStorage.removeItem("jwt_token");
      localStorage.clear();
    } catch (error) {
      navigate("/");
      localStorage.removeItem("jwt_token");
      localStorage.clear();
    }
  };

  const items = [
    {
      key: "/dashboard",
      icon: <AppstoreOutlined className="button-icon" />,
      label: "Dashboard",
      onClick: () => navigate("/dashboard"),
    },
    {
      key: "/dashboard/profile",
      icon: <UserOutlined className="button-icon" />,
      label: "Profile",
      onClick: () => navigate("/dashboard/profile"),
    },
    {
      key: "/dashboard/folders",
      icon: <FolderOutlined className="button-icon" />,
      label: "Folders",
      onClick: () => navigate("/dashboard/folders"),
    },
    {
      key: "/dashboard/files",
      icon: <FileOutlined className="button-icon" />,
      label: "Files",
      onClick: () => navigate("/dashboard/files"),
    },
    {
      key: "/texts",
      icon: <CodeOutlined className="button-icon" />,
      label: "Scripts",
      onClick: () => navigate("/texts"),
    },
    {
      key: "/editor",
      icon: <FormOutlined className="button-icon" />,
      label: "Editor",
      onClick: () => navigate("/editor"),
    },
    {
      key: "/logout",
      icon: <LogoutOutlined className="button-icon" />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  return (
    <Menu
      selectedKeys={[location.pathname]} // Dynamically highlight based on current route
      mode="inline"
      className="dashboard-menu"
      inlineCollapsed={collapsed}
      items={items}
      style={{zIndex:1000, color: "#ffffff"}}
    />
  );
};

export default MenuComponent;

