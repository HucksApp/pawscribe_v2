import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import '../css/addFolder.css'

const AddFolder = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        console.log("Folder Details:", values);
        message.success(`Folder "${values.folderName}" created successfully.`);
        onClose(); // Close the modal
        form.resetFields(); // Reset form fields
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  return (
    <Modal
      title="Add New Folder"
      className="addFolder-modal"
      visible={isVisible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Folder Name"
           className="addFolder-form-item"
          name="folderName"
          rules={[
            { required: true, message: "Please enter a folder name." },
            { min: 3, message: "Folder name must be at least 3 characters long." },
          ]}
        >
          <Input  className="addFolder-form-item-input" placeholder="Enter folder name" />
        </Form.Item>

        <Form.Item
          label="Description (Optional)"
          className="addFolder-form-item"
          name="description"
          rules={[
            { max: 200, message: "Description must not exceed 200 characters." },
          ]}
        >
          <Input.TextArea className="addFolder-form-item-input"  rows={3} placeholder="Add an optional description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddFolder;
