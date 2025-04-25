import { asyncHandler } from "../utils/asyncHandler.js"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const createProject = asyncHandler (async (req, res) => {
    const { name, description } = req.body
    const userId = req.user._id

    const existingProject = await Project.findOne({name})
    
    if(existingProject) { 
        throw new ApiError(
            401,
            "Project already created using this credentials"
        )
    }

    const project = await Project.create({
        name,
        description,
        createdBy : userId,
    })

    if(!project) {
        throw new ApiError(
            401,
            "Error while creating a project."
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project created successfully."
            
        )
    )
})

const getProjects = asyncHandler (async (req, res) => {
    const { _id } = req.user

    const projects = await Project.aggregate([
        {
            $match: {
                createdBy: _id,
            },
        },
    ])

    if(!projects) {
        throw new ApiError(401,"Project not found")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            projects,
            "Projects found successfully"
        )
    )
})

const getProjectById = asyncHandler (async (req, res) => {
    const { projectId } = req.params

    const project = await Project.findById({
        _id : projectId,
    })

    if(!project) {
        throw new ApiError(404,"Project not found.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            project,
            "Project found successfully"
        )
    )
})

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
  