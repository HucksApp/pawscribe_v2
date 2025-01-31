import React, { useState } from "react";
import FilesView from "./FilesView";
import FoldersView from "./FoldersView";
import "../css/folderviewer.css";

const FolderViewer = ({ folder }) => {
  const [currentFolder, setCurrentFolder] = useState(folder);

  return (
    <div className="folderviewer-container">
      <h2>Viewing: {currentFolder.name}</h2>
      <FoldersView />
      <FilesView />
    </div>
  );
};

export default FolderViewer;
