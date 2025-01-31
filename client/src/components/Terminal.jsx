import React, { useEffect, useRef, useState } from "react";
import { Input, Tooltip, Button, message, Typography, Space } from "antd";
import { SendOutlined, ClearOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
// import socket from "../utils/transport";
import Prompt from "./Prompt";
import "../css/terminal.css";

const { Text } = Typography;

const Terminal = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const terminalRef = useRef(null);

//   useEffect(() => {
//     socket.on("code_result", (data) => {
//       appendToHistory(`Output: ${data.output}`);
//     });

//     socket.on("command_result", (data) => {
//       appendToHistory(data.output);
//     });

//     return () => {
//       socket.off("code_result");
//       socket.off("command_result");
//     };
//   }, []);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const appendToHistory = (message) => {
    setHistory((prev) => [...prev, message]);
  };

  const handleCommand = (command) => {
    if (command.trim() === "") return;

    if (command === "clear") {
      setHistory([]);
    } else {
    //   socket.emit("send_command", { command });
      appendToHistory(`$ ${command}`);
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(input);
    }
  };

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  const handleInfo = () => {
    message.info("Type commands and hit Enter. Use 'clear' to reset.");
  };

  return (
    <div
      className="terminal-container"
      ref={terminalRef}
    >
      {/* Command History */}
      <div className="history">
        <AnimatePresence>
          {history.map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="history-item"
            >
              <Text className="history-text">{line}</Text>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="terminal-input">
            <div className="terminal-prompt-container">
        
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input-tag"
            prefix={
                <Prompt user="User" root="~" />
            }
            placeholder="Type your command..."
          />
          </div>
          <div className="console-button">
          <Tooltip title="Send Command">
            <Button
               type="danger"
              shape="circle"
              icon={<SendOutlined />}
              onClick={() => handleCommand(input)}
            />
          </Tooltip>
          <Tooltip title="Clear History">
            <Button
              type="danger"
              shape="circle"
              icon={<ClearOutlined />}
              onClick={() => setHistory([])}
            />
          </Tooltip>
          <Tooltip title="Help">
            <Button
              type="default"
              shape="circle"
              icon={<InfoCircleOutlined />}
              onClick={handleInfo}
            />
          </Tooltip>
          </div>
      </div>
    </div>
  );
};

export default Terminal;
