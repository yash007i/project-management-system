import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { File } from "../models/file.models.js";

const createFolder = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, parentId = null } = req.body;
  if (!user) {
    throw new ApiError(401, "Unauthorized User.");
  }

  if (!name || name.trim() === "") {
    throw new ApiError(400, "Folder name is required.");
  }

  if (parentId) {
    const parentFolder = await File.findOne({
      _id: parentId,
      userId: user._id,
      isFolder: true,
    });

    if (!parentFolder) {
      throw new ApiError(404, "Folder not found.");
    }

    const newFolder = await File.create({
      name: name.trim(),
      path: "",
      size: 0,
      type: "folder",
      fileUrl: "",
      thumbnailUrl: null,
      userId: user._id,
      parentId,
      isFolder: true,
      isStarred: false,
      isTrash: false,
    });

    // Step 2: Update path using the actual MongoDB-generated _id
    const updatedPath = `/folders/${user._id}/${newFolder._id}`;
    newFolder.path = updatedPath;
    const updatedFolder = await newFolder.save();

    if (!updatedFolder) {
      throw new ApiError(500, "Error while creating folder.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedFolder, "Folder created successfully."),
      );
  }
});

const getFilesByUserId = asyncHandler(async (req, res) => {
  const authUserId = req.user._id;
  const { parentId } = req.query;

  if (!authUserId) {
    throw new ApiError(401, "Unauthorized User.");
  }

  const filter = { userId: authUserId };
  if (parentId) {
    filter.parentId = parentId;
  } else {
    filter.parentId = null;
  }
  const userFiles = await File.find(filter);

  if (!userFiles) {
    throw new ApiError(404, "File not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userFiles, "Files fetched successfuly."));
});

const uploadFiles = asyncHandler(async (req, res) => {
  const userId = req.user?.id;
  const parentId = req.body.parentId || null;

  if (!req.file) {
    throw new ApiError(400, "No file provider.");
  }

  // Validate parent folder if given
  if (parentId) {
    const parentFolder = await File.findOne({
      _id: parentId,
      userId,
      isFolder: true,
    });

    if (!parentFolder) {
      throw new ApiError(404, "Parent Folder Not Found.");
    }
  }

  // Upload file to Cloudinary
  const localFilePath = req.file.path;
  const cloudinaryResponse = await uploadOnCloudinary(localFilePath);
  console.log(cloudinaryResponse);
  if (!cloudinaryResponse) {
    throw new ApiError(500, "File uploading failed.");
  }

  // Extract metadata
  const originalFilename = req.file.originalname;
  const fileSize = req.file.size;
  const mimeType = req.file.mimetype;

  // Save to DB
  const fileDoc = await File.create({
    name: originalFilename,
    path: cloudinaryResponse.public_id,
    size: fileSize,
    type: mimeType,
    fileUrl: cloudinaryResponse.secure_url,
    thumbnailUrl: cloudinaryResponse.secure_url || null, // Cloudinary URL also works for preview
    userId,
    parentId,
    isFolder: false,
    isStarred: false,
    isTrash: false,
  });

  if (!fileDoc) {
    throw new ApiError(500, "Error while uploading file.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, fileDoc, "File upload successfully."));
});
