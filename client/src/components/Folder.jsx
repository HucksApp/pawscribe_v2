import React,{useState} from "react";
import { Menu, Dropdown, Tooltip, Divider } from "antd";
import { FolderOpenOutlined, DeleteOutlined, InfoCircleOutlined, CopyOutlined, FolderFilled, GlobalOutlined , EditOutlined, FileAddFilled, FolderAddFilled} from "@ant-design/icons";
import { useDashboardContext } from "../contexts/DashboardContext";
import ConfirmationDialog from "./ConfirmationDialog";
import "../css/folder.css";

const Folder = ({ folder, onOpen, onCopy, onDelete, onInfo, onAcess, onRename, onDrop  }) => {
  const { dashImageSize } = useDashboardContext();
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow drop
  };

  const handleDragStart = (e) => {
    // Set the data being dragged (e.g., the folder ID or other identifying info)
    e.dataTransfer.setData("type", "folder");
    e.dataTransfer.setData("folder", JSON.stringify(folder));
  };

  const handleDrop = (e) => {
    e.preventDefault();
  
    // Retrieve the type of the dropped item
    const type = e.dataTransfer.getData("type");
  
    try {
      // Parse the appropriate data based on the type
      if (type === "file") {
        const droppedFile = JSON.parse(e.dataTransfer.getData("file"));
        onDrop(droppedFile, folder); // Handle file drop
      } else if (type === "folder") {
        const droppedFolder = JSON.parse(e.dataTransfer.getData("folder"));
        onDrop(droppedFolder, folder); // Handle folder drop
      } else {
        console.warn("Unknown type dropped:", type);
      }
    } catch (error) {
      console.error("Failed to handle drop:", error.message);
    }
  };
  
  


  const menu = (
    <Menu className="folder-option-menu">
      <Menu.Item className="folder-option-menu-item" key="open" icon={<FolderOpenOutlined />} onClick={() => onOpen(folder)}>
        Open
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="copy" icon={<CopyOutlined />} onClick={() => onCopy(folder)}>
        Copy
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="delete" icon={<DeleteOutlined />}  onClick={() =>setDialogVisible(true)}>
        Delete
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="info" icon={<InfoCircleOutlined />} onClick={() => onInfo(folder)}>
        Info
      </Menu.Item>

      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="rename" icon={<EditOutlined />} onClick={() => onRename(folder)}>
        Rename
      </Menu.Item>

      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="add-file" icon={<FileAddFilled />} onClick={() => onRename(folder)}>
        Add File
      </Menu.Item>

      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="add-folder" icon={<FolderAddFilled/>} onClick={() => onRename(folder)}>
       Add Folder
      </Menu.Item>

      <Divider className="item-divider" />
      <Menu.Item className="folder-option-menu-item" key="share" icon={<GlobalOutlined />} onClick={() => onAcess(folder)}>
        Share
      </Menu.Item>
    </Menu>
  );

  const handleDelete = () => {
    onDelete(folder)
    setDialogVisible(false);
  };

  const handleLeftClick = (e) => {
    e.stopPropagation(); // Prevent event propagation
    onOpen(folder); // Trigger the left-click behavior
  };

  return (
    <div className="folder-cover"
      draggable
      onDragStart={handleDragStart} // Start dragging folder
      onDragOver={handleDragOver} // Allow drop
      onDrop={handleDrop} // Handle drop
    
    >
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <Tooltip title={folder.name}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleLeftClick(e);
            }}
            onContextMenu={(e) => e.preventDefault()} // Prevent default right-click menu
            className="folder"
          >
              <FolderFilled className="folder-ant-icon" style={{ fontSize: `${dashImageSize}em` }} />
            <div>{folder.name}</div>
          </div>
        </Tooltip>
      </Dropdown>
      <ConfirmationDialog
              visible={dialogVisible}
              type={"folder"}
              title={"delete"}
              name={folder.name}
              onConfirm={handleDelete}
              onCancel={() => setDialogVisible(false)}
            />
    </div>
  );
};

export default Folder;
