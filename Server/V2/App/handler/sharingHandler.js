import Folder from "./models/Folder.js";
import File from "./models/File.js";


class SharingHandler {
 // Securely retrieve a shared folder
 static async securelyGetSharedFolder(userId, folderId) {
    const folder = await Folder.findById(folderId);
    if (!folder) return { valid: false, status: 404, error: 'Folder not found' };

    // Check if the folder is shared with the user
    const sharedUser = folder.shared_ids.find((user) => user.user_id.toString() === userId.toString());
    if (!sharedUser) return { valid: false, status: 403, error: 'Permission denied' };

    return { valid: true, status: 200, folder, isAdmin: sharedUser.admin };
  }

  // Securely retrieve a shared file
  static async securelyGetSharedFile(userId, parentFolderId, fileId) {
    const { valid, status, folder, error, isAdmin } = await this.securelyGetSharedFolder(userId, parentFolderId);

    if (!valid) return { valid, status, error };
    const file = await File.findById(fileId);

    if (!file || file.parent_folder_id.toString() !== parentFolderId.toString()) {
      return { valid: false, status: 404, error: 'File not found' };
    }

    return { valid: true, status: 200, file, isAdmin };
  }

  // Retrieve a shared folder
  static async getSharedFolder(req, res) {
    const folderId = req.params.id;
    const userId = req.user._id;

    try {
      const { valid, status, folder, error, isAdmin } = await SharingHandler.securelyGetSharedFolder(userId, folderId);

      if (!valid) return res.status(status).json({ valid, error });
      return res.status(status).json({ valid, folder, isAdmin });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Retrieve a shared file
  static async getSharedFile(req, res) {
    const fileId = req.params.id;
    const userId = req.user._id;
    const { parentFolderId } = req.body;

    try {
      const { valid, status, file, error, isAdmin } = await SharingHandler.securelyGetSharedFile(
        userId,
        parentFolderId,
        fileId
      );

      if (!valid) return res.status(status).json({ valid, error });
      return res.status(status).json({ valid, file, isAdmin });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
  
}

export default SharingHandler;