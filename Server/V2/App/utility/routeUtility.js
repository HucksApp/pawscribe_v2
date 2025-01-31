import Folder from "../Models/Folder.js";
import File from "../Models/File.js";
import FileContentManager from "../manager/FileContentManager.js";

class RouteUtility {
  /**
   * Fetch and build a folder tree for a given folder ID.
   * @param {string} folderId - ID of the folder.
   * @returns {Object} - Folder tree structure.
   */
  static async getFolderTree(folderId) {
    try {
      const folder = await Folder.findById(folderId)
        .populate("files")
        .populate("subfolders");

      if (!folder) {
        throw new Error("Folder not found");
      }

      const buildTree = async (currentFolder) => {
        const subfolders = await Promise.all(
          currentFolder.subfolders.map(async (subfolderId) => {
            const subfolder = await Folder.findById(subfolderId)
              .populate("files")
              .populate("subfolders");
            return buildTree(subfolder);
          })
        );

        return {
          id: currentFolder._id,
          name: currentFolder.name,
          files: currentFolder.files,
          subfolders,
        };
      };

      return await buildTree(folder); // Return the built tree structure
    } catch (error) {
      throw new Error(error.message); // Throw the error for the caller to handle
    }
  }

  /**
   * Add a folder's contents to a zip archive.
   * @param {Object} archive - Archiver instance.
   * @param {string} folderId - Folder ID.
   * @param {string} userId - User ID.
   * @param {string} basePath - Base path for archive entries.
   */
  static async addFolderToArchive(archive, folderId, userId, basePath = "") {
    try {
      // Find all files belonging to the folder
      const files = await File.find({
        parent_folder_id: folderId,
        owner_id: userId,
      }).populate("files");

      // Add files to archive
      for (const file of files) {
        const fileContent = await FileContentManager.retrieveContent(file.hash);
        archive.append(fileContent, { name: `${basePath}/${file.filename}` });
      }

      // Recursively process subfolders
      const subfolders = await Folder.find({
        parent_folder_id: folderId,
        owner_id: userId,
      });

      for (const folder of subfolders) {
        await this.addFolderToArchive(
          archive,
          folder._id,
          userId,
          `${basePath}/${folder.name}`
        );
      }
    } catch (error) {
      throw new Error(`Error adding folder to archive: ${error.message}`);
    }
  }

  /**
   * Recursively remove a folder and its contents.
   * @param {string} folderId - ID of the folder to delete.
   * @param {string} userId - ID of the current user.
   */
  static async removeFolderAndContents(folderId, userId) {
    try {
      const folder = await Folder.findById(folderId);
      if (!folder) throw new Error("Folder not found.");

      // Delete subfolders recursively
      const subfolders = await Folder.find({ parent_folder_id: folderId });
      for (const subfolder of subfolders) {
        await this.removeFolderAndContents(subfolder._id, userId);
      }
      // Delete files
      const files = await File.find({
        parent_folder_id: folderId,
        owner_id: userId,
      });
      for (const file of files) {
        await File.deleteFile(file._id);
      }
      // Delete the folder
      await Folder.deleteOne({ _id: folder._id });
    } catch (error) {
      throw new Error(`Error removing folder and contents: ${error.message}`);
    }
  }

  static async recursivelyUpdateSharing(folderId, userId, isGrant, isAdmin = false) {
    const folder = await Folder.findById(folderId);
    if (!folder) return;

    const subfolders = await Folder.find({ parent_folder_id: folderId });
    for (const subfolder of subfolders) {
        const existingShare = subfolder.shared_ids.find(share => 
            share.user_id.toString() === userId.toString()
        );

        if (isGrant) {
            if (!existingShare) {
                subfolder.shared_ids.push({ user_id: userId, admin: isAdmin });
            }
        } else {
            subfolder.shared_ids = subfolder.shared_ids.filter(
                share => share.user_id.toString() !== userId.toString()
            );
        }

        await subfolder.save();
        await this.recursivelyUpdateSharing(subfolder._id, userId, isGrant, isAdmin);
    }
}

}

export default RouteUtility;
