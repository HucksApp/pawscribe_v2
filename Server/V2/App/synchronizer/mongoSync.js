import { FileUtils } from '../utility/fileUtility.js';
import DockerUtility from '../utility/dockerUtility.js';
import FileSystemManager from '../manager/fileSys.js';
import FileContentManager from '../manager/FileContentManager.js';
import path from 'path';
import os from 'os';
import fs from 'fs';

class SyncMongoToContainer {
  constructor(containerId = null, dbModels = null, watchDir = null, watchDirId = null) {
    this.dockerContainerId = containerId;
    this.dbModels = dbModels;
    this.watchDir = watchDir;
    this.watchDirId = watchDirId;
    this.watchActive = false; // To track if the watch is active
    this.fileChangeStream = null;
    this.folderChangeStream = null;

    if (containerId) {
      this.dockerUtility = new DockerUtility(containerId);
    }
  }

  initSync(containerId = null, dbModels = null, watchDir = null, watchDirId = null) {
    this.dockerContainerId = containerId || this.dockerContainerId;
    this.dbModels = dbModels || this.dbModels;
    this.watchDir = watchDir || this.watchDir;
    this.watchDirId = watchDirId || this.watchDirId;

    if (containerId) {
      this.dockerUtility = new DockerUtility(containerId) || this.dockerUtility;
    }
  }

  startWatch() {
    if (this.watchActive) {
      console.warn("Watch process is already active.");
      return;
    }
    this.watchActive = true;
    console.log("Starting watch process...");

    this.fileChangeStream = this.dbModels.File.watch();
    this.folderChangeStream = this.dbModels.Folder.watch();

    this.fileChangeStream.on("change", (change) => this.handleFileChange(change));
    this.folderChangeStream.on("change", (change) => this.handleFolderChange(change));
  }



  pauseWatch() {
    if (!this.watchActive) {
      console.warn("Watch process is not active. Cannot pause.");
      return;
    }
    console.log("Pausing watch process...");
    this.closeStreams();
    this.watchActive = false;
  }

  resumeWatch() {
    if (this.watchActive) {
      console.warn("Watch process is already active.");
      return;
    }
    console.log("Resuming watch process...");
    this.startWatch();
  }

  stopWatch() {
    if (!this.watchActive) {
      console.warn("Watch process is not active. Nothing to stop.");
      return;
    }
    console.log("Stopping watch process...");
    this.closeStreams();
    this.watchActive = false;
  }

  async closeStreams() {
    if (this.fileChangeStream) {
      this.fileChangeStream.close();
      this.fileChangeStream = null;
    }
    if (this.folderChangeStream) {
      this.folderChangeStream.close();
      this.folderChangeStream = null;
    }
    console.log("Streams closed.");
  }


  async handleFileChange(change) {
    const { operationType, documentKey } = change;
    const fileId = documentKey?._id; // Handle possible null documentKey
    if (!fileId) return;

    try {
      const file = await this.dbModels.File.findById(fileId);
      if (!file) throw new Error(`File with ID ${fileId} not found`);

      const filePath = FileSystemManager.constructPathFromId(this.watchDirId, fileId, true);

      switch (operationType) {
        case 'insert':
          await this.createFileInDocker(file, filePath);
          break;
        case 'update':
          await this.updateFileInDocker(file, filePath);
          break;
        case 'delete':
          await this.deleteFileInDocker(filePath);
          break;
        default:
          console.warn(`Unsupported file operation: ${operationType}`);
      }
    } catch (error) {
      console.error(`Error handling file change: ${error.message}`);
    }
  }

  async handleFolderChange(change) {
    const { operationType, documentKey } = change;
    const folderId = documentKey?._id;
    if (!folderId) return;

    try {
      const folder = await this.dbModels.Folder.findById(folderId);
      const folderPath = path.join(this.watchDir, folderId.toString());

      switch (operationType) {
        case 'insert':
          await this.createFolderInDocker(folderPath);
          break;
        case 'delete':
          await this.deleteFolderInDocker(folderPath);
          break;
        default:
          console.warn(`Unsupported folder operation: ${operationType}`);
      }
    } catch (error) {
      console.error(`Error handling folder change: ${error.message}`);
    }
  }

  async createFileInDocker(file, filePath) {
    try {
      if (!FileUtils.validateFileName(file.filename)) throw new Error('Invalid filename');
      const tempPath = path.join(os.tmpdir(), file.filename);
      const content = FileContentManager.retrieveContent(file.hash);
      fs.writeFileSync(tempPath, content);

      await this.dockerUtility.copyFileToContainer(tempPath, filePath);
      console.log(`File created in Docker: ${filePath}`);
    } catch (error) {
      console.error(`Error creating file in Docker: ${error.message}`);
    }
  }

  async updateFileInDocker(file, filePath) {
    try {
      await this.createFileInDocker(file, filePath); // Reuse createFileInDocker logic
      console.log(`File updated in Docker: ${filePath}`);
    } catch (error) {
      console.error(`Error updating file in Docker: ${error.message}`);
    }
  }

  async deleteFileInDocker(filePath) {
    try {
      await this.dockerUtility.deleteFileInContainer(filePath);
      console.log(`File deleted from Docker: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file from Docker: ${error.message}`);
    }
  }

  async createFolderInDocker(folderPath) {
    try {
      await this.dockerUtility.createFolderInContainer(folderPath);
      console.log(`Folder created in Docker: ${folderPath}`);
    } catch (error) {
      console.error(`Error creating folder in Docker: ${error.message}`);
    }
  }

  async deleteFolderInDocker(folderPath) {
    try {
      await this.dockerUtility.deleteFolderInContainer(folderPath);
      console.log(`Folder deleted from Docker: ${folderPath}`);
    } catch (error) {
      console.error(`Error deleting folder from Docker: ${error.message}`);
    }
  }
}

export default SyncMongoToContainer;

