import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.models.js";
import { User } from "../models/user.models.js";
import { Task } from "../models/task.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { SubTask } from "../models/subtask.models.js";
import { TaskStatusEnum } from "../utils/constants.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, email, status, priority, dueDate } = req.body;
  const { projectId } = req.params;
  const user = req.user;
  const attachments = req.files.map((file) => file);

  if (!user) {
    throw new ApiError(401, "User is not authorized for creating a task.");
  }

  // Use aggregation in future
  const project = await Project.findById(projectId);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const taskUser = await User.findOne({
    email,
  });

  if (!taskUser) {
    throw new ApiError(404, "Assigned user with given email not found.");
  }

  const taskStatus = AvailableTaskStatuses.includes(status?.toLowerCase())
    ? status.toLowerCase()
    : TaskStatusEnum.TODO;

  const taskPriority = ["low", "medium", "high"].includes(
    priority?.toLowerCase(),
  )
    ? priority.toLowerCase()
    : "medium";
  // ✅ Parse dueDate from dd-mm-yyyy
  let taskDueDate;
  if (dueDate) {
    const [day, month, year] = dueDate.split("-");
    taskDueDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

    if (isNaN(taskDueDate.getTime())) {
      throw new ApiError(400, "Invalid due date format. Use dd-mm-yyyy.");
    }

    if (taskDueDate < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past.");
    }
  } else {
    taskDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days default
  }

  const task = await Task.create({
    title,
    description,
    project: project._id,
    assignedBy: user._id,
    assignedTo: taskUser._id,
    status: taskStatus,
    priority: taskPriority,
    dueDate: taskDueDate,
  });

  if (!task) {
    throw new ApiError(401, "Error while creating a task.");
  }

  const attachmentsUrls = await Promise.all(
    attachments.map((attachment) => uploadOnCloudinary(attachment.path)),
  );

  attachmentsUrls
    .filter(Boolean) // remove failed uploads
    .forEach((uploadedFile) => {
      task.attachments.push({
        url: uploadedFile.url,
        mimetype: uploadedFile.type,
        size: uploadedFile.bytes,
      });
    });

  await task.save();
  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task create successfully."));
});

const getTasks = asyncHandler(async (req, res) => {
  const user = req.user;
  const task = await Task.findOne({
    assignedTo: user._id,
  })
    .populate("project", "name description createdBy")
    .populate("assignedBy", "fullname email username");

  if (!task) {
    throw new ApiError(400, "Tasks not assign to you.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Tasks fetch successfully."));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId)
    .populate("project", "name description createdBy")
    .populate("assignedBy", "fullname email username")
    .populate("assignedTo", "fullname email username");

  if (!task) {
    throw new ApiError(404, "Task not found for geting task by id.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task fetch successfully."));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const deletedTask = await Task.findByIdAndDelete(taskId).select("-_id");

  if (!deletedTask) {
    throw new ApiError(400, "Task not found for deletelation.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedTask, "Task delete successfully."));
});

const updateTask = asyncHandler(async (req, res) => {
  const { projectId, taskId } = req.params;
  const { status, priority, dueDate, email, deleteAttachments } = req.body;
  const { user } = req.user;
  const newAttachments = req.files.map((file) => file);

  if (!user || user.role !== "admin" || user.role !== "project_admin") {
    throw new ApiError(401, "Your are not authorized to update a task.");
  }

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  const task = await Task.findOne({
    _id: taskId,
    project: projectId,
  });

  if (!task) {
    throw new ApiError(404, "Task not found for this project.");
  }

  // Update status if valid
  if (status && AvailableTaskStatuses.includes(status.toLowerCase())) {
    task.status = status.toLowerCase();
  }

  // Update priority if valid
  if (priority && ["low", "medium", "high"].includes(priority.toLowerCase())) {
    task.priority = priority.toLowerCase();
  }

  // Update dueDate if provided and valid
  if (dueDate) {
    const [day, month, year] = dueDate.split("-");
    const parsedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);

    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid due date format. Use dd-mm-yyyy.");
    }

    if (parsedDate < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past.");
    }

    task.dueDate = parsedDate;
  }

  // Reassign task to a different user if email provided
  if (email) {
    const newUser = await User.findOne({ email });
    if (!newUser) {
      throw new ApiError(404, "Assigned user with this email not found.");
    }
    task.assignedTo = newUser._id;
  }

  // ✅ Delete attachments by URL
  if (Array.isArray(deleteAttachments)) {
    task.attachments = task.attachments.filter((attachment) => {
      const shouldDelete = deleteAttachments.includes(attachment.url);
      if (shouldDelete) {
        deleteFromCloudinary(attachment.url); // Optional: implement if needed
      }
      return !shouldDelete;
    });
  }

  // ✅ Upload new attachments
  const uploadedFiles = await Promise.all(
    newAttachments.map((file) => uploadOnCloudinary(file.path)),
  );

  uploadedFiles.filter(Boolean).forEach((uploadedFile) => {
    task.attachments.push({
      url: uploadedFile.url,
      mimetype: uploadedFile.type,
      size: uploadedFile.bytes,
    });
  });

  await task.save();

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task update successfully."));
});

const createSubTask = asyncHandler(async (req, res) => {
  const { title, taskId } = req.body;
  const userId = req.user._id;

  const newSubTask = await SubTask.create({
    title,
    task: taskId,
    createdBy: userId,
  });

  if (!newSubTask) {
    throw new ApiError(400, "Error while creating a Subtask");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newSubTask, "Subtask create successfully"));
});

const getSubTask = asyncHandler(async (req, res) => {
  const user = req.user;

  const subTasks = await SubTask.find({
    createdBy: user?._id,
  })
    .populate("task", "title description project assignedBy")
    .populate("createdBy", "fullname email username");

  if (!subTasks) {
    throw new ApiError(404, "Subtasks not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTasks, "Subtasks fetched successfully."));
});

const getSubTaskById = asyncHandler(async (req, res) => {
  const { subtaskId } = req.params;
  const user = req.user;

  const subTask = await SubTask.findById(subtaskId)
    .populate("task", "title description project assignedBy")
    .populate("createdBy", "fullname email username _id");

  if (!subTask || subTask.createdBy.email !== user.email) {
    throw new ApiError(
      402,
      "Subtask not found or you are authorized for find this task.",
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, subTask, "Subtask fetched successfully."));
});

const updateSubTask = asyncHandler(async (req, res) => {
  const { title, isCompleted } = req.body;
  const { subTaskId } = req.params;
  const userId = req.user._id;

  const subTask = await SubTask.findById(subTaskId);

  if (!subTask || subTask.createdBy !== userId) {
    throw new ApiError(400, "You are not able to update a subtask");
  }

  const updatedSubTask = await SubTask.findByIdAndUpdate(
    {
      _id: subTaskId,
    },
    {
      $set: {
        title,
        isCompleted,
      },
    },
    {
      new: true,
    },
  );

  if (!updatedSubTask) {
    throw new ApiError(400, "Error while updating a subtask");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedSubTask, "Subtask updated successfully"));
});

const deleteSubTask = asyncHandler(async (req, res) => {
  const subTaskId = req.params.subTaskId;

  if (!subTaskId) {
    throw new ApiError(404, "Subtask not found");
  }

  const deletedSubTask = await SubTask.findByIdAndDelete(subTaskId);

  if (!deletedSubTask) {
    throw new ApiError(400, "Error while deleteing a task");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedSubTask, "Subtask delete successfully"));
});

export {
  createSubTask,
  createTask,
  deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateSubTask,
  updateTask,
  getSubTask,
  getSubTaskById,
};
