import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import Notify from "../services/notification";
import { useUserStore } from "../store/useUserStore.js";
import Cache from "../store/cache.js";
import "../css/form.css";

const LoginModal = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      form.resetFields(); // Reset form fields when the modal is closed
    }
  }, [open, form]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const data = await api.post("/Api/v2/auth/login", values);
      Cache.setWithExpiry("pawscribe_tokens", data.tokens);
      setUser(data.user);
      Notify({
        title: "Login Successful",
        message: data.message,
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
      title="Login"
      open={open}
      onCancel={onClose}
      className="form_modal"
      footer={[
        <Button className="form_button" key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          className="form_button"
          key="submit"
          loading={isLoading}
          onClick={handleLogin}
        >
          Login
        </Button>,
      ]}
    >
      <Form
        autocomplete="on"
        className="form"
        form={form}
        layout="vertical"
        onFinish={() => console.log("here")} // onFinish will be called when form is successfully validated
        onFinishFailed={() =>
          Notify({
            title: "Form Validation Failed",
            message: "Please fill in all required fields.",
            type: "error",
          })
        }
      >
        <Form.Item
          label="Email"
          name="email"
          className="form_item"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email address!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="form_item"
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please enter your password!" }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LoginModal;
