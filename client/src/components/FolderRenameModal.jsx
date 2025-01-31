import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import '../css/rename.css'

const FolderRenameModal = ({ visible, onClose, onRename }) => {
    const [newFolderName, setNewFolderName] = useState("");
  
    const handleSave = () => {
      onRename(newFolderName); // Pass the new name to the parent
      setNewFolderName(""); // Clear input
      onClose(); // Close the modal
    };
  
    return (
      <Modal
      className="rename-modal"
        title={<div className="rename-modal-title">Rename Folder</div>}
        visible={visible}
        onCancel={onClose}
        footer={[
          <Button type="default" key="cancel" onClick={onClose}>
            Cancel
          </Button>,
          <Button key="save" type="secondary" onClick={handleSave} disabled={!newFolderName.trim()}>
            Save
          </Button>,
        ]}
      >
        <Input
            className="rename-modal-input"
          placeholder="Enter new folder name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onPressEnter={handleSave} // Allow pressing Enter to save
        />
      </Modal>
    );
  };
  
  export default FolderRenameModal;
  