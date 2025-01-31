import React, { useState } from "react";
import {
  MenuOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
  FileOutlined,
  FolderOutlined,
  CodeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Drawer, Button, List } from "antd";
import axios from "axios";
import Notify from "../services/notification";
import { useNavigate } from "react-router-dom";

const base = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.getItem("jwt_token");

const MenuDrawer = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

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

  const DrawerList = (
    <List
      bordered
      dataSource={[
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: "Logout",
          action: handleLogout,
        },
        {
          key: "profile",
          icon: <UserOutlined />,
          label: "Profile",
          action: () => navigate("/profile"),
        },
        {
          key: "dashboard",
          icon: <DashboardOutlined />,
          label: "Dashboard",
          action: () => navigate("/dashboard"),
        },
        {
          key: "folders",
          icon: <FolderOutlined />,
          label: "Folders",
          action: () => navigate("/folders"),
        },
        {
          key: "files",
          icon: <FileOutlined />,
          label: "Files",
          action: () => navigate("/files"),
        },
        {
          key: "scripts",
          icon: <CodeOutlined />,
          label: "Scripts",
          action: () => navigate("/texts"),
        },
        {
          key: "editor",
          icon: <EditOutlined />,
          label: "Editor",
          action: () => navigate("/editor"),
        },
      ]}
      renderItem={(item) => (
        <List.Item
          onClick={item.action}
          style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          {item.icon}
          <span style={{ marginLeft: "10px" }}>{item.label}</span>
        </List.Item>
      )}
    />
  );

  return (
    <div className="menudrawer">
      <Button
        icon={<MenuOutlined />}
        type="text"
        onClick={() => toggleDrawer(true)}
        style={{ fontSize: "20px", color: "#000" }}
      />
      <Drawer
        title="Menu"
        placement="left"
        onClose={() => toggleDrawer(false)}
        open={open}
      >
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MenuDrawer;
