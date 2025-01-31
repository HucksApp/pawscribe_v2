



// Utility functions for modular operations
export class FileUtils {
  static async computeFileHash(filePath) {
    const data = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static validateFileName(filename) {
    return /^[a-zA-Z0-9_.-]+$/.test(filename);
  }

  static validateFolderName(folderName) {
    return /^[a-zA-Z0-9_.-]+$/.test(folderName);
  }

  
}
