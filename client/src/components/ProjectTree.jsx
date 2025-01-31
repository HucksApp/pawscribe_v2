import React, { useState } from 'react';
import { Tree, Menu, message, Divider } from 'antd';
import { FileOutlined, DeleteOutlined, InfoCircleOutlined, CopyOutlined, EyeOutlined, EditOutlined, FileAddFilled, FolderAddFilled, DeleteFilled, EditFilled } from "@ant-design/icons";
import ConfirmationDialog from './ConfirmationDialog';
import '../css/projectTree.css'


const { DirectoryTree } = Tree;

const ProjectTree = ({ data }) => {
  // const [selectedKeys, setSelectedKeys] = useState([]);
   const [dialogVisible, setDialogVisible] = useState(false);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  });
  const [selectedKey, setSelectedKey] = useState(null);
  const onSelect = (keys, info) => {
    console.log('Selected:', keys, info);
  };

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  const onRightClick = ({ event, node }) => {
    event.preventDefault();
    setContextMenu({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      node,
    });
  };

  const handleCloseMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, node: null });
  };

  const openFileInEditor = (key) => {
    message.success(`Opening file with key: ${key}`);
    handleCloseMenu();
  };

  const openConfirmationDialog = (key) => {
    setSelectedKey(key); // Store the key of the item to delete
    setDialogVisible(true); // Open the confirmation dialog
  };

  const handleDelete = () => {
    if (selectedKey) {
      message.success(`Deleting item with key: ${selectedKey}`);
      // Perform actual delete logic here
    }
    setDialogVisible(false);
    setSelectedKey(null); // Clear the selected key
    handleCloseMenu();
  };

  const onDelete = (key) => {
    message.success(`Deleting item with key: ${key}`);
    handleCloseMenu();
  };


  const onRename = (key) => {
    message.success(`Renaming item with key: ${key}`);
    handleCloseMenu();
  };

  const onCopy = (key) => {
    message.success(`Copying item with key: ${key}`);
    handleCloseMenu();
  };

  const onAddFile = (key) => {
    message.success(`Adding file in folder with key: ${key}`);
    handleCloseMenu();
  };

  const onAddFolder = (key) => {
    message.success(`Adding folder in folder with key: ${key}`);
    handleCloseMenu();
  };





  const renderContextMenu = () => {
    const { visible, x, y, node } = contextMenu;
    if (!visible || !node) return null;

    const { isLeaf, key } = node;
  

    return (
      <Menu
        className='project-tree-menu'
        style={{
          position:'absolute',
          top: y-50,
          left: x,
        }}
        onClick={handleCloseMenu}
      >
        {isLeaf ? (
          <>
            <Menu.Item  className="project-tree-menu-item"  onClick={() => openFileInEditor(key)}>
            <div className="project-tree-menu-item-div">
            <EyeOutlined/>
            <span>
              Open
            </span>
            </div>
            
            </Menu.Item>
            <Divider className="item-divider" />
            <Menu.Item  className="project-tree-menu-item "  onClick={() =>setDialogVisible(true)}>
            <div className="project-tree-menu-item-div">
            <DeleteOutlined/>
            <span>
            Delete
            </span>
            </div>
           
            </Menu.Item>
            <Divider className="item-divider" />
            <Menu.Item  className="project-tree-menu-item" onClick={() => onRename(key)}>
            <div className="project-tree-menu-item-div">
            <EditOutlined/>
            <span>
            Rename
            </span>
            </div>
            
            </Menu.Item>
            <Divider className="item-divider" />
            <Menu.Item className="project-tree-menu-item"  onClick={() => onCopy(key)}>
            <div className="project-tree-menu-item-div">
            <CopyOutlined/>
            <span>
            Copy
            </span>
            </div>
            
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item className="project-tree-menu-item" onClick={() => onAddFile(key)}>
            <div className="project-tree-menu-item-div">
            <FileAddFilled/>
            <span>
            Add File
            </span>
            </div>
              
              </Menu.Item>
            <Divider className="item-divider" />
            <Menu.Item className="project-tree-menu-item" onClick={() => onAddFolder(key)}>
            <div className="project-tree-menu-item-div">
            <FolderAddFilled/>
            <span>
            Add Folder
            </span>
            </div>
              
              </Menu.Item>
            <Divider className="item-divider" />
            <Menu.Item className="project-tree-menu-item" onClick={() =>setDialogVisible(true)}>
            <div className="project-tree-menu-item-div">
            <DeleteFilled/>
            <span>
            Delete Folder
            </span>
            </div>
              
              </Menu.Item>
            <Divider className="item-divider" />
            <Menu.Item className="project-tree-menu-item" onClick={() => onRename(key)}>
            <div className="project-tree-menu-item-div">
            <EditFilled/>
            <span>
            Rename Folder
            </span>
            </div>
              </Menu.Item>
          </>
        )}
      </Menu>
    );
  };



  return (
    <div onClick={handleCloseMenu} style={{ position: 'relative' }}>
      <DirectoryTree
        multiple
        draggable
        showLine
        className='project-tree'
        defaultExpandAll
        onExpand={onExpand}
        onSelect={onSelect}
        onRightClick={onRightClick}
        treeData={data}
      />
      {renderContextMenu()}
      <ConfirmationDialog
        visible={dialogVisible}
        type={contextMenu?.node?.isLeaf ? 'file' : 'folder'}
        title="delete"
        onConfirm={handleDelete}
        onCancel={() => setDialogVisible(false)}
      />
      
    </div>
  );
};

export default ProjectTree;
