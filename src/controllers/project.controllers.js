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
  // Try dd-mm-yyyy format first
  const ddmmyyyyMatch = /^(\d{2})-(\d{2})-(\d{4})$/;
  if (ddmmyyyyMatch.test(dueDateStr)) {
    const [day, month, year] = dueDateStr.split("-");
    const date = new Date(Date.UTC(+year, +month - 1, +day));
    if (
      isNaN(date.getTime()) ||
      date.getUTCFullYear() !== +year ||
      date.getUTCMonth() !== +month - 1 ||
      date.getUTCDate() !== +day
    ) {
      throw new ApiError(400, "Invalid due date format. Use dd-mm-yyyy.");
    }
    return date;
  }

  // Try parsing ISO 8601 string
  const date = new Date(dueDateStr);
  if (!isNaN(date.getTime())) {
    return date;
  }

  throw new ApiError(400, "Invalid due date format. Use dd-mm-yyyy.");
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
const getUserProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Step 1: Find all project IDs where user is a member
  const memberProjects = await ProjectMember.find({ user: userId }).select(
    "project",
  );
  const memberProjectIds = memberProjects.map((pm) => pm.project);

  // Step 2: Find all projects where user is the creator or member
  const projects = await Project.find({
    $or: [{ createdBy: userId }, { _id: { $in: memberProjectIds } }],
  }).populate("createdBy", "avatar fullname email username");

  if (!projects || projects.length === 0) {
    throw new ApiError(404, "No projects found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, projects, "Projects found successfully"));
});

const getProjectById = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  console.log(projectId);

  const projectResult = await Project.aggregate([
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
        priority: 1,
        status: 1,
        dueDate: 1,
        memberCount: 1,
        members: 1,
        createdBy: {
          fullname: 1,
          email: 1,
          username: 1,
          avatar: 1,
        },
      },
    },
    { $limit: 1 }
  ]);
  const project = projectResult[0];
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
    const parsedDate = parseDueDate(dueDate);

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

  if (!project) {
    throw new ApiError(401, "Error while updating project.");
  }
  return res.status(200).json(new ApiResponse(
    200,
    project,
    "Project updated successfully."
  ));
});

const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const deletedProject = await Project.findByIdAndDelete(projectId);

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
  const userId = req.user._id;

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
  getUserProject,
};
