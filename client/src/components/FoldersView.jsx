import React, { useState } from "react";
import FolderInfoDrawer from "./FolderInfoDrawer";
import FoldersGridView from "./GridViewComponent";
import FoldersListView from "./ListViewComponent";
import FolderStats from "./StatsComponent";
import FolderAccess from "./FolderAcess";
import FolderRenameModal from "./FolderRenameModal";
// import "../css/folderview.css";

const FoldersView = () => {
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: "Documents",
      size: "1.2GB",
      lastModified: "2025-01-07",
      items: [],
    },
    {
      id: 2,
      name: "Pictures",
      size: "500MB",
      lastModified: "2025-01-06",
      items: [],
    },
    {
      id: 3,
      name: "Videos",
      size: "5.6GB",
      lastModified: "2025-01-05",
      items: [],
    },
  ]);

  const [selectedFolder, setSelectedFolder] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [displayList, setDisplayList] = useState(true);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isFolderModalVisible, setIsFolderModalVisible] = useState(false);

  const changeDisplay = () => {
    setDisplayList(!displayList);
  };

  const viewFolderInfo = (folder) => {
    setSelectedFolder(folder);
    setInfoVisible(true);
  };

  const openFolderViewer = (folder) => {
    setSelectedFolder(folder);
    // Navigate to FolderViewer
    console.log("Opening folder viewer for:", folder.name);
  };

  const handleFolderRename = (newName) => {
    console.log("Folder renamed to:", newName);
    // Add logic to rename folder
  };

  const handleDrop = (droppedItem, targetFolder) => {
    if (droppedItem.type === "folder") {
      console.log(`Folder "${droppedItem.name}" dropped into folder "${targetFolder.name}"`);
      // Add logic to move the folder
    } else if (droppedItem.type === "file") {
      console.log(`File "${droppedItem.name}" dropped into folder "${targetFolder.name}"`);
      // Add logic to move the file
    } else {
      console.warn("Unknown item type:", droppedItem);
    }
  };
  

  return (
    <div className="foldersview-container">
      <FolderStats displayList={displayList} changeDisplay={changeDisplay} />
      {displayList ? (
        <FoldersListView
          Items={folders}
          onOpen={openFolderViewer}
          onCopy={() => console.log("hhhhh")}
          onDelete={() => console.log("hhhhh")}
          onInfo={viewFolderInfo}
          onAcess={()=>setIsShareVisible(true)}
          onRename={() => setIsFolderModalVisible(true)}
          isFile={false}
          onDrop={handleDrop} // Pass the handleDrop function
        />
      ) : (
        <FoldersGridView
          Items={folders}
          onCopy={() => console.log("hhhhh")}
          onDelete={() => console.log("hhhhh")}
          onOpen={openFolderViewer}
          onInfo={viewFolderInfo}
          isFile={false}
          onRename={() => setIsFolderModalVisible(true)}
          onAcess={()=>setIsShareVisible(true)}
          onDrop={handleDrop} // Pass the handleDrop function
        />
      )}
      <FolderInfoDrawer
        visible={infoVisible}
        folder={selectedFolder}
        onClose={() => setInfoVisible(false)}
      />
      <FolderAccess isVisible={isShareVisible} onClose={()=>setIsShareVisible(false)} />
      <FolderRenameModal
        visible={isFolderModalVisible}
        onClose={() => setIsFolderModalVisible(false)}
        onRename={handleFolderRename}
      />

    </div>
  );
};

export default FoldersView;
