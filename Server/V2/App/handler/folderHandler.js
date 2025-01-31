import Folder from "./models/Folder.js";
import File from "./models/File.js";
import FileContent from "../models/FileContent.js";
import RouteUtility from "../utility/routeUtility.js";
import archiver from "archiver";

class FolderHandler {
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

  static async getFolder(req, res) {
    const folderId = req.params.id;
    const userId = req.user._id;
    try {
      const { valid, status, folder, message } =
        await FolderHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });
      return res.status(status).json({ valid, folder });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async includeFile(req, res) {
    const userId = req.user._id;
    try {
      const folderId = req.params.id;
      const { fileId, move = false } = req.body;

      const { valid, status, folder:parentFolder, message } =
        await FolderHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });
      if (!fileId) return res.status(404).json({ error: "FileId is required" });

      const file = await File.findById(fileId);
      if (!file) return res.status(404).json({ error: "File not found" });
      if (file.owner_id.toString() !== userId)
        return res
          .status(403)
          .json({ message: "Permission denied to access the file" });

      if (move) {
        file.parent_folder_id = folderId;
        await file.save();
      } else {
        const newFile = new File({
          filename: file.filename,
          file_type: file.file_type,
          owner_id: userId,
          parent_folder_id: parentFolder._id,
          isShared: parentFolder.isShared,
          hash: file.hash,
        });
        await newFile.save();
        await FileContent.incrementReferenceCount(file.hash);
        await Folder.addToFolder(folderId, newFile._id, "files");
      }

      return res.status(200).json({
        message: move ? "File moved successfully" : "File copied successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async addFile(req, res) {
    const userId = req.user._id;
    try {
      const folderId = req.params.id;
      const { filename, fileType, content } = req.body;

      const { valid, status, message } = await FolderHandler.securelyGetFolder(
        userId,
        folderId
      );
      if (!valid) return res.status(status).json({ valid, message });

      const newFile = new File({
        filename,
        file_type: fileType,
        owner_id: userId,
        parent_folder_id: folderId,
      });

      const savedFile = await newFile.saveFile(content);
      await Folder.addToFolder(folderId, savedFile._id, "files");
      return res.status(201).json(savedFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  static async addFolder(req, res) {
    const userId = req.user._id;
    const { foldername, description, parent_folder_id } = req.body;

    if (!foldername) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    try {
      const objProps = { name: foldername, owner_id: userId };
      if (description) objProps.description = description;
      if (parent_folder_id) {
        const { valid, status, folder:parentFolder, message } =
          await FolderHandler.securelyGetFolder(userId, parent_folder_id);
        if (!valid) return res.status(status).json({ valid, message });
        objProps.parent_folder_id = parentFolder._id;
        objProps.isShared = parentFolder.isShared;
      }

      const newFolder = new Folder(objProps);
      await newFolder.save();
      res
        .status(201)
        .json({ message: "Folder created", valid: true, folder: newFolder });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getFolderWithTree(req, res) {
    const userId = req.user._id;
    const { folderId } = req.params;

    try {
      const folder = await Folder.findById(folderId);

      if (!folder || folder.owner_id.toString() !== userId) {
        return res.status(403).json({ message: "Permission denied" });
      }

      const tree = await RouteUtility.getFolderTree(folderId, userId);
      return res.status(200).json({ valid: true, folder: tree });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async downloadFolder(req, res) {
    const userId = req.user._id;
    const folderId = req.params.id;

    try {
      const { valid, folder, status, message } =
        await FolderHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });

      const archive = archiver("zip", { zlib: { level: 9 } });
      res.attachment(`${folder.foldername}.zip`);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${folder.foldername || "folder"}.zip"`
      );
      res.setHeader("Content-Type", "application/zip");
      archive.pipe(res);

      await RouteUtility.addFolderToArchive(archive, folderId, userId);
      archive.finalize();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async removeFolder(req, res) {
    const userId = req.user._id;
    const folderId = req.params.id;

    try {
      const { valid, status, message } = await FolderHandler.securelyGetFolder(
        userId,
        folderId
      );
      if (!valid) return res.status(status).json({ valid, message });

      await RouteUtility.removeFolderAndContents(folderId, userId);
      res.status(200).json({ message: "Deleted successfully", valid: true });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async grantShare(req, res) {
    const folderId = req.params.id;
    const userId = req.user._id;
    const { userEmail, isAdmin = false } = req.body;

    if (!userEmail) {
      return res
        .status(400)
        .json({ message: "User email is required to grant access." });
    }

    try {
      const { valid, status, folder, message } =
        await FolderHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });

      const accessUser = await User.findOne({ email: userEmail });
      if (!accessUser) {
        return res.status(404).json({ message: "User not found." });
      }

      const existingShare = folder.shared_ids.find(
        (share) => share.user_id.toString() === accessUser._id.toString()
      );

      if (!existingShare) {
        folder.shared_ids.push({ user_id: accessUser._id, admin: isAdmin });
        await folder.save();

        // Recursively update sharing for subfolders
        await this.recursivelyUpdateSharing(
          folderId,
          accessUser._id,
          true,
          isAdmin
        );

        return res
          .status(200)
          .json({ valid: true, message: "Access granted successfully." });
      }

      return res.status(400).json({ message: "User already has access." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async revokeShare(req, res) {
    const folderId = req.params.id;
    const userId = req.user._id;
    const { userEmail } = req.body;

    if (!userEmail) {
      return res
        .status(400)
        .json({ message: "User email is required to revoke access." });
    }

    try {
      const { valid, status, folder, message } =
        await FolderHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });

      const accessUser = await User.findOne({ email: userEmail });
      if (!accessUser) {
        return res.status(404).json({ message: "User not found." });
      }

      const userIndex = folder.shared_ids.findIndex(
        (share) => share.user_id.toString() === accessUser._id.toString()
      );

      if (userIndex === -1) {
        return res
          .status(404)
          .json({ message: "User does not have access to this folder." });
      }

      folder.shared_ids.splice(userIndex, 1);
      await folder.save();

      // Recursively update sharing for subfolders
      await this.recursivelyUpdateSharing(folderId, accessUser._id, false);

      return res
        .status(200)
        .json({ valid: true, message: "Access revoked successfully." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async changeShareAccess(req, res) {
    const folderId = req.params.id;
    const userId = req.user._id;
    const { targetUserId, isAdmin } = req.body;

    if (!targetUserId) {
      return res
        .status(400)
        .json({ message: "Target user ID is required to change access." });
    }

    try {
      const { valid, status, folder, message } =
        await FolderHandler.securelyGetFolder(userId, folderId);
      if (!valid) return res.status(status).json({ valid, message });

      const shareIndex = folder.shared_ids.findIndex(
        (share) => share.user_id.toString() === targetUserId.toString()
      );

      if (shareIndex === -1) {
        return res
          .status(404)
          .json({ message: "User does not have access to this folder." });
      }

      folder.shared_ids[shareIndex].admin = isAdmin;
      await folder.save();

      return res
        .status(200)
        .json({ valid: true, message: "Access updated successfully." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async searchFolders(req, res) {
    try {
      const {
        match = "",
        page = 1,
        per_page = 10,
        created_start,
        created_end,
        updated_start,
        updated_end,
        shared,
      } = req.query;
  
      const userId = req.user._id;
      const query = { $and: [] };
  
      // Match by folder name
      if (match) {
        query.$and.push({ name: new RegExp(match, "i") });
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
  
      // Handle shared folders (include all folders where user is shared, not limited to just user owned)
      if (shared === "true") {
        query.$and.push({
          $or: [
            { "shared_ids.user_id": userId },  // Include folders shared with the user
            { owner_id: userId },  // Include folders owned by the user
          ]
        });
      } else {
        query.$and.push({ owner_id: userId });  // If not shared, include only owned folders
      }
  
      // If no conditions are added, default to returning all folders of the user
      if (query.$and.length === 0) {
        query.$and.push({ owner_id: userId });
      }
  
      const folders = await Folder.find(query)
        .skip((page - 1) * per_page)
        .limit(parseInt(per_page))
        .lean();
  
      const total = await Folder.countDocuments(query);
  
      return res.status(200).json({
        folders,
        total,
        page: parseInt(page),
        per_page: parseInt(per_page),
        pages: Math.ceil(total / per_page),
        has_next: page * per_page < total,
        has_prev: page > 1,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error searching folders", error });
    }
  }

  static async listFolders(req, res) {
    try {
      const { page = 1, per_page = 10 } = req.query;
      const userId = req.user._id;
  
      // Fetch folders that belong to the user or are shared with the user
      const folders = await Folder.find({
        $or: [
          { owner_id: userId },  // Folders owned by the user
          { "shared_ids.user_id": userId },  // Folders shared with the user
        ]
      })
        .skip((page - 1) * per_page)
        .limit(parseInt(per_page))
        .lean();
  
      const total = await Folder.countDocuments({
        $or: [
          { owner_id: userId },  // Folders owned by the user
          { "shared_ids.user_id": userId },  // Folders shared with the user
        ]
      });
  
      return res.status(200).json({
        folders,
        total,
        page: parseInt(page),
        per_page: parseInt(per_page),
        pages: Math.ceil(total / per_page),
        has_next: page * per_page < total,
        has_prev: page > 1,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching folders", error });
    }
  }


  // List all main folders (folders without parent), both owned and shared with the user
static async listProjects(req, res) {
  try {
    const { page = 1, per_page = 10 } = req.query;
    const userId = req.user._id;

    // Fetch folders that are either owned by the user or shared with the user
    const folders = await Folder.find({
      $or: [
        { owner_id: userId, parent_folder_id: null }, // Folders owned by the user and have no parent
        { "shared_ids.user_id": userId, parent_folder_id: null }, // Folders shared with the user and have no parent
      ],
    })
      .skip((page - 1) * per_page)
      .limit(parseInt(per_page))
      .lean();

    const total = await Folder.countDocuments({
      $or: [
        { owner_id: userId, parent_folder_id: null },
        { "shared_ids.user_id": userId, parent_folder_id: null },
      ],
    });

    return res.status(200).json({
      folders,
      total,
      page: parseInt(page),
      per_page: parseInt(per_page),
      pages: Math.ceil(total / per_page),
      has_next: page * per_page < total,
      has_prev: page > 1,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching projects", error });
  }
}

  
  
}

export default FolderHandler;
