import File from "../Models/File.js";
import {
  textFileExtensions,
  binaryFileExtensions,
} from "../constants/allowedExtensions.js";
import { Readable } from "stream";
import path from "path";
import FileContentManager from "../manager/FileContentManager.js";
import Hash from "../models/Hash.js";

class FileHandler {
  static async searchFiles(req, res) {
    try {
      const { 
        match = "", 
        page = 1, 
        per_page = 10, 
        created_start, 
        created_end, 
        updated_start, 
        updated_end 
      } = req.query;
      
      const query = { $and: [] }; // Initialize query with an empty $and array to combine filters
      const userId = req.user._id;
  
      // Match by filename using a case-insensitive regex
      if (match) {
        query.$and.push({ filename: new RegExp(match, "i") });
      }
      
      // Filter by created date range
      if (created_start || created_end) {
        const createdRange = {};
        if (created_start) createdRange.$gte = new Date(created_start);
        if (created_end) createdRange.$lte = new Date(created_end);
        query.$and.push({ createdAt: createdRange });
      }
      
      // Filter by updated date range
      if (updated_start || updated_end) {
        const updatedRange = {};
        if (updated_start) updatedRange.$gte = new Date(updated_start);
        if (updated_end) updatedRange.$lte = new Date(updated_end);
        query.$and.push({ updatedAt: updatedRange });
      }
  
      // Query for owned files
      const ownedQuery = { $and: [{ owner_id: userId }] };
  
      // Fetch folders shared with the user to query for shared files
      const sharedFolderIds = await Folder.find({ "shared_ids.user_id": userId }).select('_id').lean();
      const sharedQuery = { $and: [{ parent_folder_id: { $in: sharedFolderIds.map(folder => folder._id) } }] };
  
      // Pagination setup
      const skip = (page - 1) * per_page;
      const limit = parseInt(per_page);
  
      // Fetch owned files
      const ownedFiles = await File.find({ ...ownedQuery, ...query })
        .skip(skip)
        .limit(limit)
        .lean();
  
      // Fetch shared files
      const sharedFiles = await File.find({ ...sharedQuery, ...query })
        .skip(skip)
        .limit(limit)
        .lean();
  
      // Count totals for owned and shared files
      const ownedCount = await File.countDocuments(ownedQuery);
      const sharedCount = await File.countDocuments(sharedQuery);
  
      // Combine total and pagination info
      const total = ownedCount + sharedCount;
      const has_next = page * per_page < total;
      const has_prev = page > 1;
  
      return res.status(200).json({
        ownedFiles,
        sharedFiles,
        total,
        page: parseInt(page),
        per_page: parseInt(per_page),
        pages: Math.ceil(total / per_page),
        has_next,
        has_prev,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error searching files", error });
    }
  }
  

  // List all files
  static async listFiles(req, res) {
    try {
      const { page = 1, per_page = 10 } = req.query;
      const userId = req.user._id;
  
      // Fetch folders shared with the user
      const sharedFolderIds = await Folder.find({ 
        "shared_ids.user_id": userId 
      }).select('_id').lean();
  
      // Owned files query
      const ownedFilesQuery = { owner_id: userId };
  
      // Shared files query
      const sharedFilesQuery = { 
        parent_folder_id: { $in: sharedFolderIds.map(folder => folder._id) } 
      };
  
      // Pagination setup
      const skip = (page - 1) * per_page;
      const limit = parseInt(per_page);
  
      // Fetch owned files
      const ownedFiles = await File.find(ownedFilesQuery)
        .skip(skip)
        .limit(limit)
        .lean();
  
      // Fetch shared files
      const sharedFiles = await File.find(sharedFilesQuery)
        .skip(skip)
        .limit(limit)
        .lean();
  
      // Count totals for owned and shared files
      const ownedCount = await File.countDocuments(ownedFilesQuery);
      const sharedCount = await File.countDocuments(sharedFilesQuery);
  
      // Combine total and pagination info
      const total = ownedCount + sharedCount;
      const has_next = page * per_page < total;
      const has_prev = page > 1;
  
      return res.status(200).json({
        ownedFiles,
        sharedFiles,
        total,
        page: parseInt(page),
        per_page: parseInt(per_page),
        pages: Math.ceil(total / per_page),
        has_next,
        has_prev,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching files", error });
    }
  }
  



  // Upload file
  static async uploadFile(req, res) {
    try {
      const userId = req.user._id;
      const file = req.files?.file;

      if (!file) {
        return res.status(400).json({ message: "No file provided" });
      }
      const fileExtension = path.extname(file.name).toLowerCase();
      const allowedFile =
        binaryFileExtensions.includes(fileExtension) ||
        textFileExtensions.includes(fileExtension);
      if (!allowedFile) {
        return res.status(400).json({ message: "Invalid file format" });
      }

      const fileData = file.data;

      const newFile = new File({
        filename: file.name,
        owner_id: userId,
        file_type: file.mimetype,
      });
      await newFile.saveFile(fileData);

      return res
        .status(201)
        .json({ message: "File uploaded successfully", file_id: newFile._id });
    } catch (error) {
      return res.status(500).json({ message: "Error uploading file", error });
    }
  }


  
  static async securelyGetFile(userId, fileId) {
    const file = await File.findById(fileId);
    if (!file) return { valid: false, status: 404, message: "File not found" };
    // Check folder ownership
    if (file.owner_id.toString() !== userId)
      return { message: "Permission denied", status: 403, valid: false };
    return { valid: true, status: 200, file };
  }

  // Get file by ID
  static async getFile(req, res) {
    try {
      const fileId = req.params.id;
      const userId = req.user._id;
      const { valid, file, status, message } =
        await FileHandler.securelyGetFile(userId, fileId);
      if (valid) return res.status(status).json(file);
      else return res.status(status).json({ valid, message });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching file", error });
    }
  }

  // Delete file by ID
  static async deleteFile(req, res) {
    try {
      const fileId = req.params.id;
      const userId = req.user._id;
      const { valid, status, file, message } = await FileHandler.securelyGetFile(
        userId,
        fileId
      );
      if (valid) {
        await File.deleteFile(file._id) 
        return res
          .status(status)
          .json({ message: "File deleted successfully", file_id: fileId });
      } else {
        return res.status(status).json({ valid, message });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error deleting file", error });
    }
  }

  // Download file
  static async downloadFile(req, res) {
    try {
      const fileId = req.params.id;
      const userId = req.user._id;

      //const file = await File.findById(fileId);
      const { valid, file, status, message } =
        await FileHandler.securelyGetFile(userId, fileId);
      if (!valid) return res.status(status).json({ valid, message });

      const stream = new Readable();
      stream.push(file.data);
      stream.push(null);

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`
      );
      stream.pipe(res);
    } catch (error) {
      return res.status(500).json({ message: "Error downloading file", error });
    }
  }

  static async makeNewFile(req, res) {
    try {
      const { content = null, file_name, file_type } = req.body;
      const { user } = req;
      // Create a new file if no file ID is provided
      if (!file_name || !file_type) {
        return res
          .status(400)
          .json({
            message:
              "Content, file name, and file type are required to create a new file",
            valid: false,
          });
      }

      const file = new File({
        filename: file_name,
        owner_id: user._id,
        file_type,
      });
      await file.saveFile(content);

      return res.status(200).json({
        message: "File created successfully",
        valid: true,
        file_id: file._id,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  // update old file
  static async saveFile(req, res) {
    try {
      const fileId = req.params.id;
      const { content, file_name, file_type } = req.body;
      const userId = req.user._id;

      // Find file by ID
      const { valid, file, status, message } =
        await FileHandler.securelyGetFile(userId, fileId);
      if (!valid) return res.status(status).json({ valid, message });

      // Update content and hash if content is provided
      if (content) {
        const fileHash = Hash.generateHash(content);
        if (file.hash != fileHash) 
          file.updateFileContent(content)
      }

      // Update file name if provided
      if (file_name && file_name !== file.filename) {
        file.filename = file_name;
      }

      // Update file type if provided
      if (file_type && file_type !== file.file_type) {
        file.file_type = file_type;
      }

      await file.save();

      return res.status(200).json({
        message: "File updated successfully",
        valid: true,
        file_id: file._id,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
}

export default FileHandler;
