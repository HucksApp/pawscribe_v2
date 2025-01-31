import path from 'path';
import chokidar from 'chokidar';
import winston from 'winston';
import Config from '../config/config.js';
import File from '../Models/File.js';
import Folder from '../Models/Folder.js';
import { FileUtils } from '../utility/fileUtility.js';
import FileSystemManager from '../manager/fileSys.js';
import { binaryFileExtensions, textFileExtensions } from '../constants/allowedExtensions.js';



// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: Config.LOG_FILE_PATH })
  ]
});

class SyncContainerToMongo {
  constructor( userId, watchDir, watchDirDbId, options = {}, alert=false) {
    this.userId = userId
    this.watchDirDbId = watchDirDbId
    this.alert = alert  //sending signal that db changed
    this.alertQueue = {}
    this.watchDir = watchDir;
    this.watcherOptions = options.watcher || Config.DEFAULT_WATCHER_OPTIONS;
    this.dbModels = { File, Folder };
    this.logger = logger;
  }

  startWatch(){
    this.watcher = chokidar.watch(this.watchDir, {
      persistent: true,
      usePolling: true,
      interval: 200,
      ignoreInitial: false,  // Ensure it watches all files and subdirectories from the start
      ignored: ['**/tmp/**', '**/log/**'],   // Ignore hidden files and folders (optional)
      depth: Infinity, // Watch all subdirectories at any depth (optional, defaults to Infinity)
      ...this.watcherOptions
    });
    this.watcher
      .on('add', (filePath) => this.handleFileAddition(filePath, ))
      .on('change', (filePath) => this.handleFileModification(filePath))
      .on('unlink', (filePath) => this.handleFileDeletion(filePath))
      .on('addDir', (dirPath) => this.handleFolderAddition(dirPath))
      .on('unlinkDir', (dirPath) => this.handleFolderDeletion(dirPath));

    this.logger.info(`Watcher initialized for directory: ${this.watchDir}`);
  }


  async stopWatch(){
    await this.watcher.close()
  }

  async pauseWatch(){
    await this.watcher.unwatch(this.watchDir)
  }

  async resumeWatch (){
    await this.watcher.add(this.watchDir)
  }



  encoding(filename){
    const fileExtension = path.extname(filename).toLowerCase();
    // Determine if the file is binary based on its extension
    const isBinary = binaryFileExtensions.includes(fileExtension);
    let isText = null
    if (!isBinary){
      isText = textFileExtensions.includes(fileExtension);
      if (!isText)
        return
        this.logger.info(`file type is not supported`);
  }
  return isBinary ? null : 'utf-8'
}


  async handleFileAddition(filePath) {
    try {
      const relativePath = path.relative(this.watchDir, filePath);
      const { ParentFolderId, name } = await this.extractPathDetails(relativePath, true);

      const existingFile = await this.dbModels.File.findOne({ filename: name, parent_folder_id: ParentFolderId });
      if (!existingFile){
        const fileHash = await FileUtils.computeFileHash(filePath);
  
        const fileContent = await FileSystemManager.readFileContent(filePath, this.encoding(name));

        await this.createFileInFolder(ParentFolderId, {
          name,
          file_type: path.extname(name),
          hash: fileHash
        },
        fileContent
      );
        this.logger.info(`File added: ${filePath}`);
    }
      
    } catch (error) {
      this.logger.error(`Error handling file addition: ${error.message}`);
    }
  }

  async handleFileModification(filePath) {
    try {
      const relativePath = path.relative(this.watchDir, filePath);
      const { ParentFolderId, name } = await this.extractPathDetails(relativePath, true);

      const file = await this.dbModels.File.findOne({ filename: name, folder_id: ParentFolderId });
      if (file) {
        file.hash = await FileUtils.computeFileHash(filePath);
        const fileContent = await FileSystemManager.readFileContent(filePath, this.encoding(name));
        await file.updateFileContent(fileContent);
        this.logger.info(`File modified: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error handling file modification: ${error.message}`);
    }
  }



  async handleFileDeletion(filePath) {
    try {
      const relativePath = path.relative(this.watchDir, filePath);
      const { ParentFolderId, name } = await this.extractPathDetails(relativePath, true);

      const file = await this.dbModels.File.findOne({ filename: name, parent_folder_id: ParentFolderId });
      if (file) {
        await File.deleteFile(file._id);
        this.logger.info(`File deleted: ${filePath}`);
      }
    } catch (error) {
      this.logger.error(`Error handling file deletion: ${error.message}`);
    }
  }

  async handleFolderAddition(dirPath) {
    try {
      const relativePath = path.relative(this.watchDir, dirPath);
      const { parentFolderId, name } = await this.extractPathDetails(relativePath, false);

      const existingFolder = await this.dbModels.Folder.findOne({ name, parent_folder_id: parentFolderId });
      if (!existingFolder) {
        await this.createFolderInFolder(parentFolderId, name);
        this.logger.info(`Folder added: ${dirPath}`);
      }
    } catch (error) {
      this.logger.error(`Error handling folder addition: ${error.message}`);
    }
  }

  async handleFolderDeletion(dirPath) {
    try {
      const relativePath = path.relative(this.watchDir, dirPath);
      const { parentFolderId, name } = await this.extractPathDetails(relativePath, false);

      const folder = await this.dbModels.Folder.findOne({ name, parent_folder_id: parentFolderId });
      if (folder) {
        await folder.deleteOne();
        this.logger.info(`Folder deleted: ${dirPath}`);
      }
    } catch (error) {
      this.logger.error(`Error handling folder deletion: ${error.message}`);
    }
  }

  async extractPathDetails(relativePath,  isFile = true) {

    const parts = relativePath.split(path.sep);
    const filename = isFile ? parts.pop() : null;
    const foldername = !isFile ? parts.pop() : null;
    const parent_folderPath = parts.join(path.sep);
    const parent_folder = await FileSystemManager.findItemByPath(this.watchDirDbId, this.userId, parent_folderPath, false )

    //const folder = await this.dbModels.Folder.findOne({ path: folderPath });

    if (!parent_folder) {
      throw new Error(`Folder not found for path: ${folderPath}`);
    }

    return { ParentFolderId: parent_folder._id, name: filename?filename: foldername , folderName: parts.pop() };
  }

  async createFileInFolder(folderId, fileData, fileContent) {
    if (!FileUtils.validateFileName(fileData.filename)) {
      throw new Error('Invalid filename');
    }
    const folder = await this.dbModels.Folder.findById(folderId);
    if (!folder) {
      throw new Error('Folder not found');
    }
    const newFile = new this.dbModels.File({
      ...fileData,
      folder_id: folderId,
      owner_id: folder.owner_id
    });
    await newFile.saveFile(fileContent)
    folder.files.push(newFile._id);
    await folder.save();
  }

  async createFolderInFolder(parentFolderId, folderName) {
    if (!FileUtils.validateFolderName(folderName)) {
      throw new Error('Invalid folder name');
    }
    const parentFolder = await this.dbModels.Folder.findById(parentFolderId);
    if (!parentFolder) {
      throw new Error('Parent folder not found');
    }
    const newFolder = new this.dbModels.Folder({
      name: folderName,
      owner_id: parentFolder.owner_id,
      parent_folder_id: parentFolderId
    });
    await newFolder.save();
    parentFolder.subfolders.push(newFolder._id);
    await parentFolder.save();
  }

  setLogger(loggerInstance) {
    this.logger = loggerInstance;
  }

  setDbModels(models) {
    this.dbModels = models;
  }
}

export default SyncContainerToMongo;
