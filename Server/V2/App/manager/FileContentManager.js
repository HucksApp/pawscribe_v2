import FileContent from '../models/FileContent.js';
import Hash from '../models/Hash.js';

class FileContentManager {

    static async addContent(fileType, content) {
        const fileHash = Hash.generateHash(content);

        let existingContent = await FileContent.findByHash(fileHash);
        if (!existingContent) {
            const hashId = await FileContent.storeFileContent(fileHash, content, fileType);
            existingContent = { _id: hashId };
        }

        await FileContent.incrementReferenceCount(fileHash);
        return [existingContent._id, fileHash];
    }

    static async retrieveContent(fileHash) {
        const hashedContent = await FileContent.findByHash(fileHash);
        if (hashedContent) 
            return hashedContent;
        return null;
    }

    static async removeUnreferenced() {
        await FileContent.deleteMany({ references_count: 0 });
    }

}

export default FileContentManager;
