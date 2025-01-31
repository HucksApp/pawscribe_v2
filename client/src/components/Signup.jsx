import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Notify from "../services/notification";
import { useUserStore } from "../store/useUserStore.js";
import "../css/form.css";

const SignupModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      form.resetFields(); // Reset form fields when the modal is closed
    }
  }, [open, form]);

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const response = await api.post("/Api/v1/signup", values);
      localStorage.setItem("jwt_token", response.data.token);
      setUser(response.data.user);
      Notify({
        title: "Signup Successful",
        message: response.data.message,
        type: "success",
      });
      onClose();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal
      title="Sign Up"
      open={open}
      className="form_modal"
      onCancel={onClose}
      footer={[
        <Button className="form_button" key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          className="form_button"
          key="submit"
          loading={isLoading}
          onClick={handleSignup}
        >
          Sign Up
        </Button>,
      ]}
    >
      <Form autocomplete="on" className="form" form={form} layout="vertical">
        <Form.Item
          className="form_item"
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="form_item"
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please enter your username!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="form_item"
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter your password!" },
            { min: 8, message: "Must be at least 8 characters!" },
            { max: 20, message: "Cannot exceed 20 characters!" },
            {
              pattern:
                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message:
                "At least one uppercase letter, one number, and one special character.",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SignupModal;
