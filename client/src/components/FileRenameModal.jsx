import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import '../css/rename.css'

const FileRenameModal = ({ visible, onClose, onRename }) => {
  const [newFileName, setNewFileName] = useState("");

  const handleSave = () => {
    onRename(newFileName); // Pass the new name to the parent
    setNewFileName(""); // Clear input
    onClose(); // Close the modal
  };

  return (
    <Modal
        className="rename-modal"
        title={<div className="rename-modal-title">Rename File</div>}
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" type="default" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="secondary" onClick={handleSave} disabled={!newFileName.trim()}>
          Save
        </Button>,
      ]}
    >
      <Input
        placeholder="Enter new file name"
         className="rename-modal-input"
        value={newFileName}
        onChange={(e) => setNewFileName(e.target.value)}
        onPressEnter={handleSave} // Allow pressing Enter to save
      />
    </Modal>
  );
};

export default FileRenameModal;
