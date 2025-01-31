import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import '../css/folderacess.css'

const FolderAccess = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState("");
  const [hasAccess, setHasAccess] = useState(null); // null for initial state
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Handle email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setHasAccess(null); // Reset access state when email changes
  };

  // Check access for the email
  const checkAccess = async () => {
    if (!email) {
      message.warning("Please enter an email.");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call to check access
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      const hasExistingAccess = email === "existinguser@example.com"; // Mock access condition
      setHasAccess(hasExistingAccess);
      if (hasExistingAccess) {
        message.success("This email already has access.");
      } else {
        message.info("This email does not have access.");
      }
    } catch (error) {
      message.error("Error checking access. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle share access
  const handleShare = async () => {
    setActionLoading(true);
    try {
      // Simulate API call for sharing access
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      message.success(`Access granted to ${email}.`);
      setEmail(""); // Clear email input
      setHasAccess(null); // Reset access check
    } catch (error) {
      message.error("Error sharing access. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle revoke access
  const handleRevoke = async () => {
    setActionLoading(true);
    try {
      // Simulate API call for revoking access
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock delay
      message.success(`Access revoked for ${email}.`);
      setEmail(""); // Clear email input
      setHasAccess(null); // Reset access check
    } catch (error) {
      message.error("Error revoking access. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal
    className="folder-acess-modal"
      title={<div className="folder-acess-modal-title">Folder Access</div>}
      visible={isVisible}
      onCancel={onClose}
      footer={null} // Custom footer
    >
      <div  className="folder-acess-input-cover" >
        <Input
         className="folder-acess-input"
          placeholder="Enter email address"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <div  className="folder-acess-buttons-cover" >
        <Button type="secondary" onClick={checkAccess} loading={loading}>
          Check Access
        </Button>
        {hasAccess !== null && (
          <Button
            type={hasAccess ? "danger" : "secondary"}
            onClick={hasAccess ? handleRevoke : handleShare}
            loading={actionLoading}
          >
            {hasAccess ? "Revoke Access" : "Share Access"}
          </Button>
        )}
      </div>
      <div  className="folder-acess-button-cover" style={{ textAlign: "right" }}>
        <Button type="default" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
};

export default FolderAccess;
