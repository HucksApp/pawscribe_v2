import mongoose from 'mongoose';
import FileContentManager from '../manager/FileContentManager.js';
import FileContent from './FileContent.js';
import { binaryFiles, textFiles } from '../constants/allowedExtensions.js';
import Folder from './Folder.js';

const { Schema, model, Types } = mongoose;

const fileSchema = new Schema({
    filename: { type: String, required: true },
    parent_folder_id: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
    owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    file_type: { type: String, required: true, 
        enum:[...binaryFiles, ...textFiles]
    },
    hash: { type: String,  default: null },
}, { timestamps: true, collection: 'files' });

fileSchema.statics.initializeIndexes = async function () {
    await this.collection.createIndex({ filename: 1, parent_folder_id: 1 }, { unique: true });
    console.log('Indexes initialized for the File collection.');
};

fileSchema.methods.saveFile = async function (data) {
    if(data){
    const [hashId, fileHash] = await FileContentManager.addContent(this.file_type, data);
    this.hash = fileHash;
    }
    return this.save();
};


fileSchema.statics.findByName = async function (filename, parentFolderName) {
    const folder = await Folder.getFolderByName(parentFolderName);
    if (!folder) throw new Error('Folder not found');
    return this.findOne({ filename, parent_folder_id: folder._id }).exec();
};


fileSchema.statics.findByIds = async function (fileId, parentFolderId) {
    const file = await this.findOne({
        _id: fileId,
        parent_folder_id: parentFolderId
    }).exec();

    if (!file) {
        throw new Error('File not found');
    }
    return file
};

fileSchema.methods.updateFileContent = async function (newContent) {
    if (newContent) {
        // Step 1: Decrement the reference count of the current content
        if (this.hash) {
            const fileContent = await FileContent.findByHash(this.hash);
            if (fileContent) {
                await FileContent.decrementReferenceCount(this.hash);
            }
        }

        // Step 2: Add the new content and generate the new hash
        const [newHashId, newFileHash] = await FileContentManager.addContent(this.file_type, newContent);

        // Step 3: Update the file's hash with the new content's hash
        this.hash = newFileHash;

        // Step 4: Save the updated file document
        await this.save();
        await FileContentManager.removeUnreferenced()
    } else {
        throw new Error('New content must be provided');
    }
};



fileSchema.statics.findById = async function (fileId) {
    return this.findOne({ _id: Types.ObjectId(fileId) }).exec();
};

fileSchema.statics.listFilesInFolder = async function (folderId, userId) {
    return this.find({ parent_folder_id: folderId, owner_id: Types.ObjectId(userId) }).exec();
};

fileSchema.statics.deleteFile = async function (fileId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const file = await this.findById(fileId).session(session);
        if (!file) 
            throw new Error('File not found');
        await this.deleteOne({ _id: fileId }).session(session);
        const decrementResult = await FileContent.decrementReferenceCount(file.hash).session(session);
        if (decrementResult.modifiedCount > 0) {
            const fileContent = await FileContent.findByHash(file.hash).session(session);
            if (fileContent && fileContent.references_count <= 0) {
                // Remove unreferenced content
                await FileContent.deleteOne({ hash: file.hash }).session(session);
            }
        }
        await session.commitTransaction();
    } catch (error) {
        // Rollback transaction on error
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};


export default model('File', fileSchema);
