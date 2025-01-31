import React, { useState, useRef } from "react";
import { Button, Collapse, Tooltip, Space, Typography } from "antd";
import { motion } from "framer-motion";
import Draggable from "react-draggable";
import {
  PlusOutlined,
  DeleteOutlined,
  PauseCircleFilled,
  PlayCircleFilled,
  DownOutlined,
  UpCircleFilled,
} from "@ant-design/icons";
import Terminal from "./Terminal"; // Terminal component placeholder
import "../css/terminalStack.css";

const { Panel } = Collapse;
const { Text } = Typography;

const TerminalStack = () => {
  const [terminals, setTerminals] = useState([]); // Terminal instances
  const [visible, setVisible] = useState(true);
  const [pausedTerminals, setPausedTerminals] = useState([]);
  const [dragging, setDragging] = useState(false); // Track dragging state
  const [height, setHeight] = useState(300); // Initial height of the terminal stack
  const resizeRef = useRef(null);

  // Add a terminal
  const addTerminal = () => {
    setTerminals((prev) => [...prev, prev.length + 1]);
  };

  // Remove a terminal
  const removeTerminal = (id) => {
    setTerminals((prev) => prev.filter((terminalId) => terminalId !== id));
    setPausedTerminals((prev) => prev.filter((terminalId) => terminalId !== id));
  };

  // Pause/Resume terminal
  const togglePauseTerminal = (id) => {
    setPausedTerminals((prev) =>
      prev.includes(id) ? prev.filter((terminalId) => terminalId !== id) : [...prev, id]
    );
  };

  // Toggle visibility of terminal stack
  const toggleStack = () => {
    setVisible(!visible);
  };

  // Handle resizing the terminal stack
  const handleMouseDown = (e) => {
    const startY = e.clientY;
    const startHeight = height;

    const onMouseMove = (e) => {
      const newHeight = Math.max(startHeight + (startY - e.clientY), 100); // Minimum height: 100px
      setHeight(newHeight);
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <>
      {/* Draggable Floating Button */}
      {!visible && (
        <Draggable
          onStart={() => setDragging(true)} // Start dragging
          onDrag={() => setDragging(true)} // Continue dragging
          onStop={() => setDragging(false)} // Stop dragging
        >
          <div className="draggable-toggle">
            <Tooltip title="Show Terminal Stack">
              <Button
                type="secondary"
                shape="circle"
                className="draggable-toggle-button"
                icon={<UpCircleFilled />}
                onMouseDown={(e) => {
                  // Prevent toggling on mouse down when dragging
                  if (dragging) {
                    e.preventDefault();
                  }
                }}
                onClick={(e) => {
                  if (!dragging) {
                    toggleStack();
                  }
                }}
              />
            </Tooltip>
          </div>
        </Draggable>
      )}

      {/* Terminal Stack */}
      <motion.div
        className="terminal-stack-container"
        animate={{ y: visible ? 0 : 500 }}
        transition={{ type: "spring", stiffness: 100 }}
        style={{ height }}
      >
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          className="resize-handle"
          onMouseDown={handleMouseDown}
        ></div>

        {/* Stack controls */}
        <div className="stack-controls">
          <Space>
            <Tooltip title="Add Terminal">
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<PlusOutlined />}
                onClick={addTerminal}
              />
            </Tooltip>
            <Tooltip title={visible ? "Hide Stack" : "Show Stack"}>
              <Button
                type="default"
                shape="circle"
                size="small"
                icon={<DownOutlined />}
                onClick={toggleStack}
              />
            </Tooltip>
          </Space>
        </div>

        {/* Terminal Stack */}
        <Collapse
          bordered={false}
          expandIconPosition="start"
          
        >
          {terminals.map((id) => (
            <Panel
              className="terminal-stack-panel"
              key={id}
              header={
                <div className="panel-header">
                  <Text className="panel-header-text" style={{ color: ` ${pausedTerminals.includes(id)?"#FE4D4F": "#4CAF50" }` }}>
                    Terminal {id}
                  </Text>
                  <Space>
                    <Tooltip title={pausedTerminals.includes(id) ? "Resume" : "Pause"}>
                      <Button
                        type="secondary"
                        shape="circle"
                        icon={
                          pausedTerminals.includes(id) ? (
                            <PlayCircleFilled />
                          ) : (
                            <PauseCircleFilled />
                          )
                        }
                        onClick={() => togglePauseTerminal(id)}
                      />
                    </Tooltip>
                    <Tooltip title="Delete">
                      <Button
                        type="text"
                        danger
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => removeTerminal(id)}
                      />
                    </Tooltip>
                  </Space>
                </div>
              }
            >
              <Terminal  paused={pausedTerminals.includes(id)} />
            </Panel>
          ))}
        </Collapse>
      </motion.div>
    </>
  );
};

export default TerminalStack;
