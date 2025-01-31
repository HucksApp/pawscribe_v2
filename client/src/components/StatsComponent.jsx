import React, { useState } from "react";
import { Tooltip } from "antd";
import {
  FileAddFilled,
  FolderAddFilled,
  ProfileFilled,
  ToolFilled,
  ProductFilled ,
} from "@ant-design/icons";
import CustomPagination from "./Paginnation";
import ProjectToolModal from "./ProjectToolModal";
import AddFile from "./AddFile";
import AddFolder from "./AddFolder";

const StatsComponent = ({ displayList, changeDisplay, isFile }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isToolModalVisible, setIsToolModalVisible] = useState(false);

  const handleRunGitCommand = (action, repoUrl) => {
    console.log(`Running Git ${action} command for ${repoUrl}`);
  };

  const handleRunDockerCommand = () => {
    console.log("Running Docker command...");
  }
  const onPageChange = (page) => {
    setCurrentPage(page); // Update current page
  };

  return (
    <div className="file-stats">
      {isFile ? (
        <AddFile isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      ) : (
        <AddFolder isVisible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      )}

      <CustomPagination
        total={50}
        pageSize={5}
        currentPage={currentPage}
        onPageChange={onPageChange}
      >
        <Tooltip placement="left" title={`${displayList ? "Grid" : "List"} layout`}>
          <button className="toggle-button" onClick={changeDisplay}>
            {displayList ? (
              <ProductFilled style={{ color: "var(--text-primary)" }} />
            ) : (
              <ProfileFilled style={{ color: "var(--text-primary)" }} />
            )}
          </button>
        </Tooltip>

        <Tooltip placement="left" title={`Add New ${isFile ? "File" : "Folder"}`}>
          <button
            className="toggle-button"
            onClick={() => setIsModalVisible(true)}
          >
            {isFile ? (
              <FileAddFilled style={{ color: "var(--button-primary-bg-color)" }} />
            ) : (
              <FolderAddFilled style={{ color: "var(--button-primary-bg-color)" }} />
            )}
          </button>
        </Tooltip>
        {!isFile &&
            <Tooltip placement="left"  title="Project Tools">
              <button  className="toggle-button" onClick={() => setIsToolModalVisible(true)}>
                <ToolFilled style={{ color: "var(--button-primary-bg-color)" }} />
            </button>
         </Tooltip>
          }
      </CustomPagination>
      <ProjectToolModal
        visible={isToolModalVisible}
        onClose={() => setIsToolModalVisible(false)}
        onRunGitCommand={handleRunGitCommand}
        onRunDockerCommand={handleRunDockerCommand}
      />
    </div>
  );
};

export default StatsComponent;
