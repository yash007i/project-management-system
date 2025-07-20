import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema(
  {
    // Unique identifier for each file/folder
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },

    // Basic file/folder information
    name: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true, // 0 for folders
    },
    type: {
      type: String,
      required: true, // MIME type or "folder"
    },

    // Storage information
    fileUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: null,
    },

    // Ownership and hierarchy
    userId: {
      type: String, // or Schema.Types.ObjectId if you have a separate User collection
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "File",
      default: null, // null for root
    },

    // Flags
    isFolder: {
      type: Boolean,
      default: false,
      required: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
      required: true,
    },
    isTrash: {
      type: Boolean,
      default: false,
      required: true,
    },

    // Timestamps
  },
  { timestamps: true },
);

export const File = mongoose.model("File", fileSchema);
