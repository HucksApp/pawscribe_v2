import React from "react";
import { Button, Input, Tooltip, message } from "antd";
import { DockerOutlined, InfoCircleOutlined, PlayCircleFilled } from "@ant-design/icons";
import '../css/dockerTool.css'
const DockerTool = ({ onRunDockerCommand }) => {
  const showHelp = () => {
    message.info("Enter the source and destination folders to copy files in Docker.");
  };

  const handleRun = () => {
    onRunDockerCommand();
  };

  return (
    <div
    className="docker-tool-kit"
    >
      <div style={{ padding: "16px" }}>
        <h3>Copy Files</h3>
        <Input
        prefix={<DockerOutlined/>}
          placeholder="Source folder"
          style={{ marginBottom: "8px" }}
        />
        <Input
          placeholder="Destination folder"
          prefix={<DockerOutlined/>}
          style={{ marginBottom: "16px" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tooltip title="Help">
            <Button icon={<InfoCircleOutlined />} onClick={showHelp} />
          </Tooltip>
          <Button className="docker-tool-kit-run" type="secondary" icon={<PlayCircleFilled />} onClick={handleRun}>
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DockerTool;
