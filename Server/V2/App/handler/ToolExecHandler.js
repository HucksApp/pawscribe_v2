import { exec } from "child_process";
import { rmSync } from "fs";
import Folder from "../Models/Folder.js";
import File from "../Models/File.js";
import FileContentManager from "../manager/FileContentManager.js";
import Hash from "../models/Hash.js";

class ToolHandler {
  static async securelyGetFolder(userId, folderId) {
    const folder = await Folder.findById(folderId);
    if (!folder) {
      return { valid: false, status: 404, error: "Folder not found" };
    }
    // Check folder ownership
    if (folder.owner_id.toString() !== userId) {
      return {
        status: 403,
        valid: false,
        message: "Permission denied",
      };
    }
    return { valid: true, status: 200, folder };
  }

  static async pullRepo(req, res) {
    const { repoUrl, folderId } = req.body;
    const userId = req.user._id;

    if (!repoUrl || !folderId) {
      return res
        .status(400)
        .json({ message: "Missing repository URL or folder ID." });
    }

    try {
      const tmpDir = `./tmp/${Date.now()}`;
      await execPromise(`git clone ${repoUrl} ${tmpDir}`);

      // Get folder details from MongoDB
      const { valid, status, folder, message } =
        await ToolHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });

      // Process the changes in the cloned repository
      await this.processDirectory(tmpDir, folder._id, userId, true);

      return res.status(200).json({
        message: "Repository changes pulled and updated successfully.",
      });
    } catch (error) {
      return res.status(500).json({ message: "Error pulling changes.", error });
    }
  }

  static async pushRepo(req, res) {
    const { repoUrl, commitMessage, folderId, branch } = req.body;
    const userId = req.user._id;

    if (!repoUrl || !commitMessage || !folderId) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const tmpDir = `./tmp/${Date.now()}`;
    try {
      // Initialize Git repo or sync if already initialized
      await execPromise(`git init ${tmpDir}`);
      await execPromise(`cd ${tmpDir} && git remote add origin ${repoUrl}`);

      // Write files from MongoDB to the temporary Git directory
      await this.writeFilesToDirectory(tmpDir, userId);

      // Commit and push changes
      await execPromise(`cd ${tmpDir} && git add .`);
      await execPromise(`cd ${tmpDir} && git commit -m "${commitMessage}"`);
      await execPromise(
        `cd ${tmpDir} && git push -u origin ${branch || "master"}`
      );

      return res
        .status(200)
        .json({ message: "Repository pushed successfully." });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error pushing repository.", error });
    } finally {
      cleanupTemporaryDirectory(tmpDir);
    }
  }

  static async cloneRepo(req, res) {
    const { repoUrl } = req.body;
    const userId = req.user._id;

    if (!repoUrl) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const tmpDir = `./tmp/${Date.now()}`;
    try {
      // Clone the Git repository
      await execPromise(`git clone ${repoUrl} ${tmpDir}`);

      // Create a new folder for the project (without a parent)
      const newFolder = new Folder({
        name: repoUrl.split("/").pop().replace(".git", ""), // Folder name based on the repo
        owner: userId,
        parent: null, // No parent folder
        type: "project", // Specify the folder type (could be 'project' or any other)
      });

      // Save the new folder to MongoDB
      await newFolder.save();

      // Process the cloned directory and save it to MongoDB
      await this.processDirectory(tmpDir, newFolder._id, userId);

      return res.status(200).json({
        message:
          "Repository cloned and new project folder created successfully.",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error cloning repository.", error });
    } finally {
      cleanupTemporaryDirectory(tmpDir);
    }
  }

  static async processDirectory(
    directoryPath,
    parentFolderId,
    ownerId,
    isPull = false
  ) {
    const fs = require("fs");
    const path = require("path");

    const items = fs.readdirSync(directoryPath);
    for (const item of items) {
      const fullPath = path.join(directoryPath, item);
      const stat = fs.lstatSync(fullPath);

      if (stat.isDirectory()) {
        // Process directory - check if it exists in MongoDB
        const existingFolder = await Folder.findOne({
          name: item,
          parent_folder_id: parentFolderId,
          owner_id: ownerId,
        });

        if (existingFolder) {
          // Process subfolder contents
          await this.processDirectory(
            fullPath,
            existingFolder._id,
            ownerId,
            isPull
          );
        } else {
          // Add new subfolder to MongoDB
          const newFolder = new Folder({
            name: item,
            parent_folder_id: parentFolderId,
            owner_id: ownerId,
          });
          await newFolder.save();
          // Recursively process this folder's contents
          await this.processDirectory(fullPath, newFolder._id, ownerId, isPull);
        }
      } else if (stat.isFile()) {
        // Process file
        const content = fs.readFileSync(fullPath);
        const fileType = path.extname(item).substring(1);

        // Check if the file already exists in MongoDB
        const existingFile = await File.findOne({
          filename: item,
          parent_folder_id: parentFolderId,
          owner_id: ownerId,
        });

        if (existingFile) {
        // Check if the file content has changed (using hash comparison)
          const fileHash = Hash.generateHash(content);
          if (existingFile.hash !== fileHash) 
            existingFile.updateFileContent(content)
        } else {
          // Add new file to MongoDB
          const file = new File({
            filename: item,
            parent_folder_id: parentFolderId,
            owner_id: ownerId,
            file_type: fileType,
          });
          await file.saveFile(content);
        }
      }
    }

    // After processing the directory, check for any deletions (files/folders that were removed)
    if (isPull) {
      await this.removeDeletedItems(directoryPath, parentFolderId, ownerId);
    }
  }

  // Method to check and remove files and folders no longer present in the repo
  static async removeDeletedItems(directoryPath, parentFolderId, ownerId) {
    const fs = require("fs");
    const path = require("path");

    const items = fs.readdirSync(directoryPath);

    // Get current files and folders in MongoDB
    const folders = await Folder.find({
      parent_folder_id: parentFolderId,
      owner_id: ownerId,
    });
    const files = await File.find({
      parent_folder_id: parentFolderId,
      owner_id: ownerId,
    });

    // Compare with what's in the directory and remove any missing items
    for (const folder of folders) {
      const folderPath = path.join(directoryPath, folder.name);
      if (!fs.existsSync(folderPath)) {
        // Folder no longer exists, remove it
        await Folder.deleteFolder(folder._id);
      }
    }

    for (const file of files) {
      const filePath = path.join(directoryPath, file.filename);
      if (!fs.existsSync(filePath)) {
        // File no longer exists, remove it
        await File.deleteOne({ _id: file._id });
      }
    }
  }

  static async writeFilesToDirectory(directoryPath, ownerId) {
    const fs = require("fs");
    const path = require("path");

    const rootFolders = await Folder.find({
      owner_id: ownerId,
      parent_folder_id: null,
    });
    const rootFiles = await File.find({
      owner_id: ownerId,
      parent_folder_id: null,
    });

    for (const folder of rootFolders) {
      const folderPath = path.join(directoryPath, folder.name);
      fs.mkdirSync(folderPath);
      await this.writeFolderContent(folderPath, folder._id, ownerId);
    }

    for (const file of rootFiles) {
      const fileContent = await FileContentManager.retrieveContent(file.hash);
      fs.writeFileSync(
        path.join(directoryPath, file.filename),
        fileContent.content
      );
    }
  }

  static async writeFolderContent(folderPath, folderId, ownerId) {
    const fs = require("fs");
    const path = require("path");

    const subFolders = await Folder.find({
      owner_id: ownerId,
      parent_folder_id: folderId,
    });
    const files = await File.find({
      owner_id: ownerId,
      parent_folder_id: folderId,
    });

    for (const folder of subFolders) {
      const subFolderPath = path.join(folderPath, folder.name);
      fs.mkdirSync(subFolderPath);
      await this.writeFolderContent(subFolderPath, folder._id, ownerId);
    }

    for (const file of files) {
      const fileContent = await FileContentManager.retrieveContent(file.hash);
      fs.writeFileSync(
        path.join(folderPath, file.filename),
        fileContent.content
      );
    }
  }

  static cleanupTemporaryDirectory(directory) {
    try {
      rmSync(directory, { recursive: true, force: true });
    } catch (err) {
      console.error(`Failed to remove temporary directory ${directory}:`, err);
    }
  }
}

function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) return reject(error);
      resolve(stdout || stderr);
    });
  });
}

export default ToolHandler;
