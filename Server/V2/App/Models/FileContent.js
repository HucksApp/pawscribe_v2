import mongoose from "mongoose";
import { buffer } from "stream/consumers";

const { Schema, model, models } = mongoose;

const fileContentSchema = new Schema(
  {
    hash: { type: String, unique: true, required: true },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      validate: {
        validator: (value) =>
          typeof value === "string" || Buffer.isBuffer(value),
        message: "Content must be either a string or a buffer.",
      },
    },
    file_type: { type: String, required: true },
    references_count: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "file_content" }
);

fileContentSchema.statics.storeFileContent = async function (
  fileHash,
  content,
  fileType
) {
  const hashData = {
    hash: fileHash,
    content,
    file_type: fileType,
    references_count: 0,
  };
  const doc = await this.create(hashData);
  return doc._id;
};

fileContentSchema.statics.findByHash = function (fileHash) {
  return this.findOne({ hash: fileHash }).exec();
};

fileContentSchema.statics.incrementReferenceCount = function (fileHash) {
  return this.updateOne(
    { hash: fileHash },
    { $inc: { references_count: 1 } }
  ).exec();
};

fileContentSchema.statics.decrementReferenceCount = function (fileHash) {
  return this.updateOne(
    { hash: fileHash },
    { $inc: { references_count: -1 } }
  ).exec();
};


export default models.FileContent || model("FileContent", fileContentSchema);
