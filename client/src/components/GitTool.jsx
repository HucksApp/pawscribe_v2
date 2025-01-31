import React, { useState } from "react";
import { Collapse, Input, Radio, Button, message, Tooltip } from "antd";
import { GithubOutlined, InfoCircleOutlined, PlayCircleFilled } from "@ant-design/icons";
import '../css/gitTool.css'

const GitTool = ({ onRunGitCommand }) => {
  const [action, setAction] = useState("push");
  const [repoUrl, setRepoUrl] = useState("");

  const handleRun = () => {
    if (!repoUrl) {
      message.error("Please enter a valid repository URL.");
      return;
    }
    onRunGitCommand(action, repoUrl);
  };

  const showHelp = () => {
    message.info("Enter a valid repository URL and select an action (Push or Pull).");
  };

  const actions = [
    {
        label: 'Push',
        value: 'Push',
      },
      {
        label: 'Pull',
        value: 'Pull',
      },
  ]


  return (
    <div
     className="git-tool-kit"
    >
     {/* <div >
        <GithubOutlined style={{ fontSize: "24px", marginRight: "8px" }} />
        Git Tools
    </div> */}
      <div style={{ padding: "16px" }}>
        <h3>Supported Actions</h3>
        <Radio.Group
          value={action}
          options={actions}
          onChange={(e) => setAction(e.target.value)}
          optionType="button"
            buttonStyle="solid"
          style={{ marginBottom: "16px", backgroundColor:"#fff" }}

        />
          
        <Input
          placeholder="Enter repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          prefix={<GithubOutlined />}
          style={{ marginBottom: "16px" }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Tooltip title="Help">
            <Button icon={<InfoCircleOutlined />} onClick={showHelp} />
          </Tooltip>
          <Button type="secondary" className="git-tool-kit-run" icon={<PlayCircleFilled />} onClick={handleRun}>
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GitTool;
