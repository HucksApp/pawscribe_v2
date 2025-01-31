import React, { useState, useEffect } from "react";
import GridFilesView from "./GridViewComponent";
import ListFilesView from "./ListViewComponent";
import FileViewer from "./FileViewer";
import FileInfoDrawer from "./FileInfoDrawer";
import FileStats from "./StatsComponent";
import FileRenameModal from "./FileRenameModal";
import '../css/fileview.css'

const FilesView = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [displayList, setDisplayList] = useState(true);
  const [isFileModalVisible, setIsFileModalVisible] = useState(false);

  const changeDisplay = () => {
    setDisplayList(!displayList);
  }


  const handleFileRename = (newName) => {
    console.log("File renamed to:", newName);
    // Add logic to rename file
  };

  const handleDrop = (droppedItem, targetFolder) => {
    if (droppedItem.type === "file") {
      console.log(`File "${droppedItem.name}" dropped into folder "${targetFolder.name}"`);
      // Add logic to move the file
    } else if (droppedItem.type === "folder") {
      console.log(`Folder "${droppedItem.name}" dropped into folder "${targetFolder.name}"`);
      // Add logic to move the folder
    } else {
      console.warn("Unknown item type:", droppedItem);
    }
  };

  useEffect(() => {
    const dummyFiles = [
      {
        id: 1,
        name: "image1.jpg",
        type: "image/jpeg",
        size: 2048,
        lastModified: "2025-01-07",
        url: "https://via.placeholder.com/150",
      },
      {
        id: 2,
        name: "document.pdf",
        type: "application/pdf",
        size: 1024,
        lastModified: "2025-01-06",
        url: "https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf",
      },
      {
        id: 3,
        name: "code.js",
        type: "text/javascript",
        size: 512,
        lastModified: "2025-01-05",
        content: `console.log('Hello World');`,
      },
      {
        id: 4,
        name: "notes.txt",
        type: "text/plain",
        size: 256,
        lastModified: "2025-01-04",
        content: `These are some dummy notes for testing.`,
      },
    ];

    setFiles(dummyFiles);
  }, []);

  const openFile = (file) => {
    setSelectedFile(file);
    setViewerVisible(true);
  };

  const viewInfo = (file) => {
    setSelectedFile(file);
    setInfoVisible(true);
  };

  return (
    <div className="fileview-container">
      <FileStats displayList={displayList} changeDisplay={changeDisplay} isFile={true}/>
      {displayList ? (
        <ListFilesView 
          Items={files} 
          onOpen={openFile} 
          onCopy={() => {}} 
          onDelete={() => {}} 
          onInfo={viewInfo} 
          isFile={true}
          onRename={() => setIsFileModalVisible(true)}
          onDrop={handleDrop} // Pass handleDrop as a prop
        />
      ) : (
        <GridFilesView 
          Items={files} 
          onOpen={openFile} 
          onCopy={() => {}} 
          onDelete={() => {}} 
          onInfo={viewInfo} 
          isFile={true}
          onRename={() => setIsFileModalVisible(true)}
          onDrop={handleDrop} // Pass handleDrop as a prop
        />
      )}

      <FileViewer visible={viewerVisible} file={selectedFile} onClose={() => setViewerVisible(false)} />
      <FileInfoDrawer visible={infoVisible} file={selectedFile} onClose={() => setInfoVisible(false)} />
      <FileRenameModal
        visible={isFileModalVisible}
        onClose={() => setIsFileModalVisible(false)}
        onRename={handleFileRename}
      />
    </div>
  );
};

export default FilesView;
