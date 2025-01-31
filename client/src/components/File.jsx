import React, {useState} from "react";
import { Menu, Dropdown, Tooltip, Divider } from "antd";
import { FileOutlined, DeleteOutlined, InfoCircleOutlined, CopyOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import FileUtility from "../utils/FileUtility";
import { useDashboardContext } from "../contexts/DashboardContext";
import ConfirmationDialog from "./ConfirmationDialog";
import "../css/file.css";


const File = ({ file, onOpen, onCopy, onDelete, onInfo, onRename /*onDrop*/ }) => {

  const [dialogVisible, setDialogVisible] = useState(false);
  const { dashImageSize } = useDashboardContext();

  const handleDragStart = (e) => {
  e.dataTransfer.setData("type", "file"); // Set type explicitly
  e.dataTransfer.setData("file", JSON.stringify(file)); // Serialize file data
};




  const menu = (
    <Menu className="file-option-menu">
      <Menu.Item className="file-option-menu-item" key="open" icon={<EyeOutlined />} onClick={() => onOpen(file)}>
        Open
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="file-option-menu-item" key="copy" icon={<CopyOutlined />} onClick={() => onCopy(file)}>
        Copy
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="file-option-menu-item" key="delete" icon={<DeleteOutlined />} onClick={() =>setDialogVisible(true)}>
        Delete
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="file-option-menu-item" key="rename" icon={<EditOutlined />} onClick={() => onRename(file)}>
        Rename
      </Menu.Item>
      <Divider className="item-divider" />
      <Menu.Item className="file-option-menu-item" key="info" icon={<InfoCircleOutlined />} onClick={() => onInfo(file)}>
        Info
      </Menu.Item>
    </Menu>
  );

  const handleLeftClick = (e) => {
    e.stopPropagation(); // Prevent event propagation
    onOpen(file); // Trigger the left-click behavior
  };

  const handleDelete = () => {
    onDelete(file)
    setDialogVisible(false);
  };

  const {isImg, Icon} = FileUtility.fileIcon(file.name)

  return (
    <div className="file-cover"
    draggable
    onDragStart={handleDragStart}
    >
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      <Tooltip title={file.name}>
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleLeftClick(e);
          }}
          onContextMenu={(e) => e.preventDefault()} // Prevent default right-click menu
          className="file"
        >
          {isImg?
            <div className="file-img-icon-cover">
            <img style={{height:`${dashImageSize}em`, width:`${dashImageSize}em`}} className="file-img-icon" src={Icon} />
            </div>
            : 
            <Icon className="file-ant-icon" style={{fontSize: `${dashImageSize}em`}}/>
          }
          <div>{file.name}</div>
        </div>
      </Tooltip>
    </Dropdown>
    <ConfirmationDialog
        visible={dialogVisible}
        type={"file"}
        title={"delete"}
        name={file.filename}
        onConfirm={handleDelete}
        onCancel={() => setDialogVisible(false)}
      />
    </div>
  );
};

export default File;

