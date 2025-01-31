import React from "react";
import { Modal, Collapse } from "antd";
import { GithubFilled, DockerOutlined } from "@ant-design/icons";
import GitTool from "./GitTool";
import DockerTool from "./DockerTool";
import '../css/projectToolKit.css'


const ProjectToolModal = ({ visible, onClose, onRunGitCommand, onRunDockerCommand }) => {

    const toolList = [
        {
            key: 'git',
            label: <div className="tool-kit-compartment"><GithubFilled className="tool-kit-compartment-icon" style={{fontSize:"1.5em"}}/> <span>Git Tools Kit</span></div>,
            children: <GitTool onRunGitCommand={onRunGitCommand} />,
          },
          {
            key: 'docker',
            label:<div className="tool-kit-compartment"><DockerOutlined className="tool-kit-compartment-icon" style={{fontSize:"1.5em"}}/> <span> Docker Tools Kit</span> </div>,
            children: <DockerTool onRunDockerCommand={onRunDockerCommand} />,
          }
        
    ]

  return (
    <Modal
      title="PROJECT TOOLS KIT"
      className="tool-kit-modal"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {/* <Collapse accordion>
        <GitTool onRunGitCommand={onRunGitCommand} />
        <DockerTool onRunDockerCommand={onRunDockerCommand} />
      </Collapse> */}
      <Collapse items={toolList} />;

    </Modal>
  );
};

export default ProjectToolModal;
