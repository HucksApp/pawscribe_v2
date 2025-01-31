import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;

const folderSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true, default: null },
  owner_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  parent_folder_id: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  files: [{ type: Schema.Types.ObjectId, ref: 'File' }],
  subfolders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
  shared_ids: [{
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    admin: { type: Boolean, default: false }
  }],
}, {timestamps: true, collection: 'folders' });

// Method to save a folder
folderSchema.methods.saveFolder = async function () {
  return this.save();
};

folderSchema.statics.initializeIndexes = async function () {
  await this.collection.createIndex({ name: 1, parent_folder_id: 1 }, { unique: true });
  console.log('Indexes initialized for the File collection.');
};


// Static method to add an item (file or folder) to the folder
folderSchema.statics.addToFolder = async function (folderId, itemId, itemType = 'files') {
  const updateObj = { $push: { [itemType]: itemId } };
  return this.updateOne({ _id: Types.ObjectId(folderId) }, updateObj);
};

// Static method to remove an item from the folder
folderSchema.statics.removeFromFolder = async function (folderId, itemId, itemType) {
  const updateObj = { $pull: { [itemType]: itemId } };
  return this.updateOne({ _id: Types.ObjectId(folderId) }, updateObj);
};

// Static method to update folder properties
folderSchema.statics.updateFolderProps = async function (folderId, itemValue, itemType) {
  const updateObj = { $set: { [itemType]: itemValue } };
  return this.updateOne({ _id: Types.ObjectId(folderId) }, updateObj);
};

// Static method to get a folder by ID
folderSchema.statics.findById = async function (folderId) {
  return this.findOne({ _id: Types.ObjectId(folderId) }).exec();
};


// Static method to delete a folder
folderSchema.statics.deleteFolder = async function (folderId) {
  return this.deleteOne({ _id: Types.ObjectId(folderId) });
};

// Static method to move a file between folders
folderSchema.statics.moveFileBetweenFolders = async function (sourceFolderId, targetFolderId, fileId) {
  await this.removeFromFolder(sourceFolderId, fileId, 'files');
  await this.addToFolder(targetFolderId, fileId, 'files');
};

// Static method to move a subfolder between folders
folderSchema.statics.moveSubfolderBetweenFolders = async function (sourceFolderId, targetFolderId, subfolderId) {
  await this.removeFromFolder(sourceFolderId, subfolderId, 'subfolders');
  await this.addToFolder(targetFolderId, subfolderId, 'subfolders');
};

// Export the model
export default model('Folder', folderSchema);
