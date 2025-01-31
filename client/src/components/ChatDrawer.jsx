import React, { useState, useEffect } from 'react';
import { Button, Input, List, Typography, Tooltip, Popover } from 'antd';
import { SendOutlined, CloseOutlined, SmileOutlined, RightCircleFilled } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Picker from '@emoji-mart/react';// Import emoji picker
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import { useTheme } from '../contexts/ThemeProvider';
// import '@emoji-mart/react/styles.css'; // CSS for v5+
import "../css/chatdrawer.css";

const { Text } = Typography;
const socket = io.connect('http://0.0.0.0:8000'); // Adjust the URL accordingly

const ChatPanel = ({ open, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
   const { themeMode } = useTheme();

  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prevMessages) => [...prevMessages, { text: message, sent: false }]); // Mark as received
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', newMessage);
      setMessages((prev) => [...prev, { text: `You: ${newMessage}`, sent: true }]); // Mark as sent
      setNewMessage('');
    }
  };

  const addEmoji = (emoji) => {
    setNewMessage((prev) => `${prev}${emoji.native}`); // Add emoji to the message
    setEmojiPickerVisible(false); // Close the emoji picker
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: open ? '0%' : '100%' }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="chat-drawer-container"
    >
      <div className="chat-drawer-list-container">
        <Tooltip title="Close Chat Drawer">
          <button className="icon-button" onClick={onClose}>
            <RightCircleFilled style={{ fontSize: "1.3em" }} className="button-icon" />
          </button>
        </Tooltip>
        <Text className="chat-drawer-title" strong>
          CHAT
        </Text>
        <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="chat-drawer-list"
      >
        <List
          className="chat-list"
          dataSource={messages}
          renderItem={(msg, index) => (
            <List.Item
              key={index}
              className={`chat-list-item ${msg.sent ? 'sent' : 'received'}`} // Add class based on `sent`
            >
              <Text className="chat-list-text">{msg.text}</Text>
            </List.Item>
          )}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="chat-drawer-input-container"
      >

        <Input
          placeholder="Type a message"
          value={newMessage}
          prefix={
            <Popover
            content={<Picker theme={themeMode} onSelect={addEmoji} />}
            trigger="click"
            style={{zIndex:5000, border:"solid red"}}
            visible={emojiPickerVisible}
            onVisibleChange={(visible) => setEmojiPickerVisible(visible)}
          >
            <Button
              icon={<SmileOutlined />}
              onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
            />
          </Popover>
          }
          onChange={(e) => setNewMessage(e.target.value)}
          onPressEnter={sendMessage}
          className="chat-drawer-input"
        />
        <Button
          className="chat-drawer-button"
          type="secondary"
          icon={<SendOutlined />}
          onClick={sendMessage}
        />
      </motion.div>
    </motion.div>
  );
};

ChatPanel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ChatPanel;
