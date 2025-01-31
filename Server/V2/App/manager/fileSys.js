import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import Folder from '../Models/Folder.js';
import File from '../Models/File.js';
import FileContentManager from './FileContentManager.js';
import { Types } from 'mongoose';
import { FileUtils } from '../utility/fileUtility.js';

class FileSystemManager extends FileUtils {
    constructor() {}




/**
* Reads and returns the content of a file.
* 
* @param {string} filePath - Path to the file.
* @param {string|null} encoding - File encoding ('utf-8' for text, null for binary).
* @returns {Promise<string|Buffer>} - The file content as a string or binary buffer.
* @throws {Error} - If the file cannot be read.
*/
static async readFileContent(filePath, encoding = 'utf-8') {
 try {
   const content = await fs.readFile(filePath, encoding);
   return content;
 } catch (error) {
   throw new Error(`Error reading file at ${filePath}: ${error.message}`);
 }
}


/**
 * Find the ID of a file or subfolder given its path and the top-most folder ID.
 * 
 * @param {string} rootFolderId - The ID of the top-most folder (root folder).
 * @param {string} userId - User ID of the folder owner.
 * @param {string} targetPath - The full path of the file or subfolder to find.
 * @param {boolean|null} isFile - Specifies the type of item to search for: 
 *                                true = search for files only, 
 *                                false = search for folders only, 
 *                                null = search both (default).
 * @returns {string|null} - The ID of the file or subfolder, or null if not found.
 */

static async findItemByPath(rootFolderId, userId, targetPath, isFile = null) {
    const normalizedTargetPath = path.normalize(targetPath);

    /**
     * Recursively search for the file or folder in the directory tree.
     * @param {string} currentFolderId - The current folder's ID.
     * @param {string} currentPath - The current folder's path.
     * @returns {Object|null} - The file or folder object if found, or null otherwise.
     */
    async function searchFolder(currentFolderId, currentPath) {
        // Fetch the current folder
        const currentFolder = await Folder.findById(currentFolderId);
        if (!currentFolder) return null;

        const currentFolderFullPath = path.join(currentPath, currentFolder.name);

        // 1. Search for folders only if isFile is false or null
        if ((isFile === false || isFile === null) && currentFolderFullPath === normalizedTargetPath) {
            return currentFolder; // Return the folder object if matched
        }

        // 2. Search files in the current folder only if isFile is true or null
        if (isFile === true || isFile === null) {
            const files = await File.find({
                parent_folder_id: currentFolderId,
                owner_id: Types.ObjectId(userId)
            });

            for (const file of files) {
                const filePath = path.join(currentFolderFullPath, file.filename);
                if (filePath === normalizedTargetPath) {
                    return file; // Return the file object if matched
                }
            }
        }

        // 3. Recursively search subfolders
        const subfolders = await Folder.find({
            parent_folder_id: currentFolderId,
            owner_id: Types.ObjectId(userId)
        });

        for (const subfolder of subfolders) {
            const result = await searchFolder(subfolder._id, currentFolderFullPath);
            if (result) return result; // Return the file or folder object if found
        }

        return null; // Not found in this branch
    }

    // Start searching from the top-most folder
    return await searchFolder(rootFolderId, '');
}




    /**
     * Clean a temporary directory if it exists.
     * @param {string} tempDir - Path to the temporary directory.
     */
    static async cleanTemporaryDirectory(tempDir) {
        if (await fs.pathExists(tempDir)) {
            await fs.remove(tempDir);
        }
    }

    /**
     * Recursively creates folder structures and adds files in a temporary directory.
     * Identifies the specified entry point file.
     * 
     * @param {Object} currentFolder - Current folder document.
     * @param {string} userId - User ID of the folder owner.
     * @param {string} baseDirectory - Base directory for creating structure.
     * @param {string} entryPointFileId - File ID to mark as entry point.
     * @returns {Object} Entry point file and its path.
     */
    static async buildFolderStructure(currentFolder, userId, baseDirectory = '', entryPointFileId = null) {
        const folderPath = path.join(baseDirectory, currentFolder.name);
        await fs.ensureDir(folderPath);

        let entryPointFile = null;
        let entryPointFilePath = null;

        // Fetch and process files in the folder
        const files = await File.find({ parent_folder_id: currentFolder._id, owner_id: Types.ObjectId(userId) });
        for (const file of files) {
            const fileData = await FileContentManager.retrieveContent(file.hash);
            const filePath = path.join(folderPath, file.filename);
            await fs.writeFile(filePath, fileData.content);

            if (file._id.toString() === entryPointFileId) {
                entryPointFile = file;
                entryPointFilePath = filePath;
            }
        }
        // Recursively process subfolders
        const subfolders = await Folder.find({ parent_folder_id: currentFolder._id, owner_id: Types.ObjectId(userId) });
        for (const subfolder of subfolders) {
            const { entryPoint, entryPointPath } = await this.buildFolderStructure(
                subfolder,
                userId,
                folderPath,
                entryPointFileId
            );
            if (entryPoint) {
                entryPointFile = entryPoint;
                entryPointFilePath = entryPointPath;
            }
        }
        return { entryPointFile, entryPointFilePath };
    }

    
    /**
     * Builds a folder hierarchy structure and identifies the entry point file.
     * 
     * @param {string} rootFolderId - ID of the root folder.
     * @param {string} userId - User ID of the folder owner.
     * @param {string} entryPointFileId - File ID to mark as entry point.
     * @param {string} temporaryDirectory - Path to the temporary directory.
     * @returns {Object} Entry point file and its path.
     */
    static async buildProjectFromFolder(rootFolderId, userId, entryPointFileId, temporaryDirectory) {
        const rootFolder = await Folder.findById(rootFolderId);
        if (!rootFolder) throw new Error('Root folder not found');

        const { entryPointFile, entryPointFilePath } = await this.buildFolderStructure(
            rootFolder,
            userId,
            temporaryDirectory,
            entryPointFileId
        );

        return { entryPointFile, entryPointFilePath };
    }

    // /**
    //  * Handles a single file by saving it to a temporary directory.
    //  * 
    //  * @param {string} fileId - File ID to be processed.
    //  * @returns {string} Path to the temporary directory containing the file.
    //  */
    // static async buildProjectFromFile(fileId) {
    //     const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'project-'));

    //     const file = await File.findById(fileId);
    //     if (!file) throw new Error('File not found');
    //     const fileData = await FileContentManager.retrieveContent(file.hash);
    //     const filePath = path.join(tempDir, file.filename);

    //     await fs.writeFile(filePath, fileData.content);
    //     return { tempDir, entryPointFilePath: filePath };
    // }

    /**
     * Determines the entry point and constructs the project structure.
     * 
     * @param {string} rootFolderId - Root folder ID (optional).
     * @param {string} userId - User ID of the project owner.
     * @param {string} entryPointFileId - Entry point file ID.
     * @param {string} type - Type of entry point ('Folder' or 'File').
     * @param {string} temporaryDirectory - Temporary directory for project structure.
     * @returns {Object} Entry point file and its path.
     */
    static async determineEntryPoint(rootFolderId, userId, entryPointFileId,temporaryDirectory) {
        if (rootFolderId) 
            return await this.buildProjectFromFolder(rootFolderId, userId, entryPointFileId, temporaryDirectory);
        throw new Error('Invalid entry point type or missing root folder ID.');
    }

    /**
 * Constructs the full path of a file or folder given its ID and the root folder ID.
 * 
 * @param {string} rootFolderId - The ID of the root folder (top-most folder).
 * @param {string} targetId - The ID of the file or folder for which to construct the path.
 * @param {string} userId - The ID of the user who owns the folder or file.
 * @returns {Promise<string>} - The full path to the file or folder.
 * @throws {Error} - If the target file or folder cannot be found.
 */
static async constructPathFromId(rootFolderId, targetId, userId, isFile=null) {
    async function traverseUpwards(currentId, isFile) {
        if (!currentId) throw new Error('Target ID is required');

        // Check if the current ID is a file
        if (isFile) {
            const file = await File.findOne({ _id: Types.ObjectId(currentId), owner_id: Types.ObjectId(userId) });
            if (!file) throw new Error('File not found');

            const parentFolder = await Folder.findOne({ _id: file.parent_folder_id, owner_id: Types.ObjectId(userId) });
            const parentPath = await traverseUpwards(parentFolder?._id, false);

            return path.join(parentPath, file.filename);
        }
        // Otherwise, it is a folder
        const folder = await Folder.findOne({ _id: Types.ObjectId(currentId), owner_id: Types.ObjectId(userId) });
        if (!folder) throw new Error('Folder not found');

        if (folder._id.toString() === rootFolderId) {
            return folder.name; // Base case: root folder
        }

        const parentFolder = await Folder.findOne({ _id: folder.parent_folder_id, owner_id: Types.ObjectId(userId) });
        const parentPath = parentFolder ? await traverseUpwards(parentFolder._id, false) : '';

        return path.join(parentPath, folder.name);
    }

    // Determine if the target is a file or folder
    if (isFile === null)
        isFile = await File.exists({ _id: Types.ObjectId(targetId), owner_id: Types.ObjectId(userId) });
    return await traverseUpwards(targetId, isFile);
}

}

export default FileSystemManager;
