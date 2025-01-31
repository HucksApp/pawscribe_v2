import React, { useEffect } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import axios from "axios";
import PropTypes from "prop-types";
import { Dropdown, Menu, Button, Modal, Card, notification } from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  EditOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  TeamOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useFileStore } from "../store/fileStore"; // Zustand store
import "../css/fileview.css";

const FileView = ({ file, setStateChange }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwt_token");
  const { addFileBlob } = useFileStore((state) => state); // Zustand store action
  const base = process.env.REACT_APP_BASE_API_URL;

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(
          `${base}/Api/v1/files/download/${file.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            responseType: "blob",
          }
        );
        const url = URL.createObjectURL(response.data);
        addFileBlob(file.id.toString(), response.data); // Add to Zustand store
      } catch (error) {
        if (error.response?.data?.msg === "Token has expired") {
          navigate("/");
        } else {
          notification.error({
            message: "Error",
            description: `${error.message}. ${error.response?.data?.message}`,
          });
        }
      }
    };

    fetchFile();
  }, [file.id, addFileBlob, navigate]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${base}/Api/v1/files/${file.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      notification.success({ message: response.data.message });
      setStateChange(true);
    } catch (error) {
      if (error.response?.data?.msg === "Token has expired") {
        navigate("/");
      } else {
        notification.error({
          message: "Error",
          description: `${error.message}. ${error.response?.data?.message}`,
        });
      }
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = file.url; // Assuming `file.url` contains the file URL
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notification.success({ message: "File Downloaded" });
  };

  const handlePrivacy = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/files/private/${file.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      notification.success({ message: response.data.message });
      setStateChange(true);
    } catch (error) {
      if (error.response?.data?.msg === "Token has expired") {
        navigate("/");
      } else {
        notification.error({
          message: "Error",
          description: `${error.message}. ${error.response?.data?.message}`,
        });
      }
    }
  };

  const handleEdit = () => {
    navigate(`/editor?fileId=${file.id}`);
  };

  const handleView = () => {
    const params = { id: file.id, type: "File", src: file.url };
    navigate(`/viewfile?${createSearchParams(params)}`);
  };

  const handleShare = async () => {
    try {
      const response = await axios.get(
        `${base}/Api/v1/files/share/${file.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      notification.success({ message: response.data.message });
    } catch (error) {
      if (error.response?.data?.msg === "Token has expired") {
        navigate("/");
      } else {
        notification.error({
          message: "Error",
          description: `${error.message}. ${error.response?.data?.message}`,
        });
      }
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={handleEdit} icon={<EditOutlined />}>
        Edit
      </Menu.Item>
      <Menu.Item
        key="delete"
        onClick={() =>
          Modal.confirm({
            title: `Delete ${file.filename}?`,
            content: "Are you sure you want to delete this file?",
            onOk: handleDelete,
          })
        }
        icon={<DeleteOutlined />}
      >
        Delete
      </Menu.Item>
      <Menu.Item key="share" onClick={handleShare} icon={<ShareAltOutlined />}>
        Share
      </Menu.Item>
      <Menu.Item key="download" onClick={handleDownload} icon={<DownloadOutlined />}>
        Download
      </Menu.Item>
      <Menu.Item key="privacy" onClick={handlePrivacy} icon={file.private ? <LockOutlined /> : <UnlockOutlined />}>
        {file.private ? "Make Public" : "Make Private"}
      </Menu.Item>
      <Menu.Item key="view" onClick={handleView} icon={<InfoCircleOutlined />}>
        View File
      </Menu.Item>
    </Menu>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{
        duration: 0.7,
        ease: "easeInOut",
      }}
    >
      <Card
        title={file.filename}
        actions={[
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>,
        ]}
      >
        <iframe
          src={file.url}
          style={{
            maxWidth: "100%",
            height: "300px",
            border: "none",
          }}
          title={file.name}
        />
      </Card>
    </motion.div>
  );
};

FileView.propTypes = {
  file: PropTypes.object.isRequired,
  setStateChange: PropTypes.func.isRequired,
};

export default FileView;
