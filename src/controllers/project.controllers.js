import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ProjectMember } from "../models/projectmember.models.js";
import { User } from "../models/user.models.js";
import mongoose from "mongoose";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

// Optional helper to parse dd-mm-yyyy into JS Date
function parseDueDate(dueDateStr) {
  const [day, month, year] = dueDateStr.split("-");
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  if (isNaN(date.getTime())) {
    throw new ApiError(400, "Invalid due date format. Use dd-mm-yyyy.");
  }
  return date;
}

const createProject = asyncHandler(async (req, res) => {
  const { name, description, dueDate, status, priority } = req.body;
  const userId = req.user?._id;

  const existingProject = await Project.findOne({ name });

  if (existingProject) {
    throw new ApiError(401, "Project already created using this credentials");
  }

  // Validate and parse fields
  const validStatuses = ["not started", "in progress", "completed", "on hold"];
  const validPriorities = ["low", "medium", "high", "critical"];

  const parsedStatus = validStatuses.includes(status?.toLowerCase())
    ? status.toLowerCase()
    : "not started";

  const parsedPriority = validPriorities.includes(priority?.toLowerCase())
    ? priority.toLowerCase()
    : "medium";

  let parsedDueDate;
  if (dueDate) {
    parsedDueDate = parseDueDate(dueDate);
    if (parsedDueDate < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past.");
    } else {
      parsedDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default: 30 days
    }
  }

  const project = await Project.create({
    name,
    description,
    createdBy: userId,
    members: [userId],
    dueDate: parsedDueDate, // optional
    status: parsedStatus, // optional
    priority: parsedPriority, // optional
  });

  if (!project) {
    throw new ApiError(401, "Error while creating a project.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project created successfully."));
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().populate(
    "createdBy",
    "avatar fullname email username",
  );

  if (!projects) {
    throw new ApiError(401, "Project not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects found successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  console.log(projectId);

  const project = await Project.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(projectId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "createdBy",
      },
    },
    {
      $unwind: "$createdBy",
    },
    {
      $project: {
        name: 1,
        description: 1,
        createdBy: {
          fullname: 1,
          email: 1,
          username: 1,
          avatar: 1,
        },
      },
    },
  ]);

  if (!project) {
    throw new ApiError(404, "Project not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project found successfully"));
});

const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { name, description, dueDate, status, priority } = req.body;
  const userId = req.user?._id;

  if (!projectId) {
    throw new ApiError(404, "Project not found");
  }

  const project = await Project.findById(projectId);

  if (String(project.createdBy) !== String(userId)) {
    throw new ApiError(403, "You are not authorized to update this project.");
  }
  if (name) {
    project.name = name;
  }
  if (description) {
    project.description = description;
  }

  if (dueDate) {
    const [day, month, year] = dueDate.split("-");
    const parsedDate = new Date(`${year}-${month}-${day}T00:00:00Z`);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid due date format. Use dd-mm-yyyy.");
    }
    if (parsedDate < new Date()) {
      throw new ApiError(400, "Due date cannot be in the past.");
    }
    project.dueDate = parsedDate;
  }

  const validStatuses = ["not started", "in progress", "completed", "on hold"];
  if (status && validStatuses.includes(status.toLowerCase())) {
    project.status = status.toLowerCase();
  }

  const validPriorities = ["low", "medium", "high", "critical"];
  if (priority && validPriorities.includes(priority.toLowerCase())) {
    project.priority = priority.toLowerCase();
  }

  await project.save();

  if(!project) {
    throw new ApiError(401, "Error while updating project.")
  }
  return res
    .status(200)
    .json(200, project, "Project update successfully.");
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const deletedProject = await Project.findByIdAndDelete({
    project: projectId,
  });

  if (!deletedProject) {
    throw new ApiError(400, "Error while delete a project");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedProject, "Project delete successfully."));
});

const addMemberToProject = asyncHandler(async (req, res) => {
  const { projectId, memberId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "User not found for this project.");
  }

  if (user.role !== UserRolesEnum.ADMIN && user.role !== "project_admin") {
    console.log(user.role);
    throw new ApiError(
      403,
      "You are not authorized to add members to this project",
    );
  }

  const existedMember = await ProjectMember.findOne({
    user: memberId,
  });

  if (existedMember) {
    throw new ApiError(401, "This user is already part of project.");
  }

  const newProjectMember = await ProjectMember.create({
    project: projectId,
    user: memberId,
  });

  if (!newProjectMember) {
    throw new ApiError(400, "Project member creation failed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newProjectMember,
        "Add new member in project successfully.",
      ),
    );
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  if (!projectId) {
    throw new ApiError(404, "Project not found for this id.");
  }

  const projectMember = await ProjectMember.findOne({
    project: projectId,
  })
    .populate("project", "name description createdBy")
    .populate("user", "fullname email avatar username");

  if (!projectMember) {
    throw new ApiError(401, "Project member is not found.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        projectMember,
        "Project member fetched successfully.",
      ),
    );
});

const deleteMember = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const userId = req.user._id;

  const user = await User.findById(userId);

  if (user.role !== "admin" && user.role !== "project_admin") {
    throw new ApiError(
      403,
      "You are not authorized to delete members from this project",
    );
  }

  const deletedMember = await ProjectMember.findOneAndDelete({
    user: memberId,
  });
  console.log(deletedMember);

  if (!deletedMember) {
    throw new ApiError(404, "Member not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Member deleted", deletedMember));
});

const updateMemberRole = asyncHandler(async (req, res) => {
  const { memberId } = req.params;
  const { role } = req.body;
  const { userId } = req.user._id;

  const user = await User.findById(userId);
  if (user.role !== "admin" && user.role !== "project_admin") {
    throw new ApiError(
      403,
      "You are not authorized to update role of this member",
    );
  }

  const updatedMember = await ProjectMember.findByIdAndUpdate(
    {
      user: memberId,
    },
    {
      $set: {
        role,
      },
    },
    { new: true }, // returns the updated document
  );

  if (!updatedMember) {
    throw new ApiError(404, "Member not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Member updated", updatedMember));
});

export {
  addMemberToProject,
  createProject,
  deleteMember,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateMemberRole,
  updateProject,
};
