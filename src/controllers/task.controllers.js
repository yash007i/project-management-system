import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Project } from "../models/project.models.js"
import { User } from "../models/user.models.js"
import { Task } from "../models/task.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createTask = asyncHandler( async (req, res) => {
    const{ title, description, projectName, email, status } = req.body
    const { user } = req.user
    const { attachments } = req.files.map((file) => file)

    if(!user || user.role !== "admin") {
        throw new ApiError(400, "User is not authorized for creating a task.")
    }

    // Use aggregation in future
    const project = await Project.findOne({
        name: projectName
    })

    if(!project) {
        throw new ApiError(404, "Project not found.")
    }

    const taskUser = await User.findOne({
        email
    })

    const task = await Task.create({
        title,
        description,
        project : project._id,
        assignedBy : user._id,
        assignedTo : taskUser._id,
    })

    if(!task) {
        throw new ApiError(401, "Error while creating a task.")
    }

    if( !(attachments.length > 0)) {
        throw new ApiError(400, "Files not found.")
    }

    const attachmentsUrls = await Promise.all(
        attachments.map((attachment) => uploadOnCloudinary(attachment)),
      );
  
    attachmentsUrls
        .filter(Boolean) // remove failed uploads
        .forEach((uploadedFile) => {
          task.attachments.push({
            url: uploadedFile.url,
            mimetype : uploadedFile.type,
            size : uploadedFile.bytes,
          });
        });

    await task.save()
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            task,
            "Task create successfully."
        )
    )
})

const getTasks = asyncHandler (async (req, res) => {
    const { user } = req.user

    const task = await Task.find({
        assignedTo : user._id
    })

    if(!task){
        throw new ApiError(400, "Tasks not assign to you.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            "Tasks fetch successfully."
        )
    )
})

const getTaskById = asyncHandler (async (req, res) => {
    const { taskId } = req.params.taskId

    const task = await Task.findById(taskId)

    if(!task) {
        throw new ApiError(404, "Task not found for geting task by id.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            task,
            "Task fetch successfully."
        )
    )
})

const deleteTask = asyncHandler (async (req, res) => {
    const { taskId } = req.params.taskId

    const deletedTask = Task.findByIdAndDelete(taskId).select("-_id")

    if(!deletedTask) {
        throw new ApiError(400, "Task not found for deletelation.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            deletedTask,
            "Task delete successfully."
        )
    )
})
  
const updateTask = asyncHandler (async (req, res) => {
    const { taskId } = req.params.taskId
    const { title, description, projectId, assignedToId, status } =req.body
    const { user } = req.user
    const attachments = req.files.map((file) => file);

    if(!user || user.role !== "admin"){
        throw new ApiError(400, "Your are not authorized to update a task.")
    }

    const updatedTask =  await Task.findByIdAndUpdate(
        {
            _id : taskId
        },
        {
            $set : {
                title,
                description,
                project: projectId,
                assignedTo: assignedToId,
                status,
            }
        },
        {
            new : true
        }
    )

    if(!updatedTask) {
        throw new ApiError(404, "Task not found for update.") 
    }

    if (attachments.length > 0) {
        const attachmentsUrls = await Promise.all(
            attachments.map((attachment) => uploadOnCloudinary(attachment)),
          );
      
        attachmentsUrls
            .filter(Boolean) // remove failed uploads
            .forEach((uploadedFile) => {
                updatedTask.attachments.push({
                url: uploadedFile.url,
                mimetype : uploadedFile.type,
                size : uploadedFile.bytes,
              });
            });
    }
    await updatedTask.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            updatedTask,
            "Task update successfully."
        )
    )
})

export {
  // createSubTask,
  createTask,
  // deleteSubTask,
  deleteTask,
  getTaskById,
  getTasks,
  // updateSubTask,
  updateTask,
};
  