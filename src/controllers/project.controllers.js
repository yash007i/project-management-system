import { asyncHandler } from "../utils/asyncHandler.js"
import { Project } from "../models/project.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ProjectMember } from "../models/projectmember.models.js"
import { User } from "../models/user.models.js"
 
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
    const projects = await Project.find()
    
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

    const user = await Project.aggregate([
        {
            $match : {
                createdBy : new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup : {
                from : "users",
                localField : "createdBy",
                foreignField : "_id",
                as : "user",
            }
        },
        { 
            $project : {
                fullname : 1,
                email : 1,
                username : 1,
                avatar : 1,
            }
        },
        {
            $addFields : {
                user : {
                    $first : "$user"
                }
            }
        }
    ])

    const data = {
        project : project,
        projectCreatedBy : user,
    }
    if(!project) {
        throw new ApiError(404,"Project not found.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "Project found successfully"
        )
    )
})

const updateProject = asyncHandler (async (req, res) => {
    const { projectId } = req.params
    const { name, description } = req.body

    if(!projectId) {
        throw new ApiError(404, "Project not found")
    }

    const updatedProject = await Project.findByIdAndUpdate(
        {
            _id : projectId,
        },
        {
          $set : {
            name,
            description,
          },  
        },
        {
            new : true // Return updated data
        },
    )

    if(!updatedProject) {
        throw new ApiError(401, "Project not found for update.")
    }

    return res.status(200)
    .json(
        200,
        updatedProject,
        "Project update successfully."
    )
})

const deleteProject = asyncHandler (async (req, res) => {
    const { projectId } = req.params

    const deletedProject = await Project.findByIdAndDelete({
        project : projectId
    })

    if(!deletedProject) {
        throw new ApiError(400, "Error while delete a project")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            deletedProject,
            "Project delete successfully."
        )
    )
})

const addMemberToProject = asyncHandler (async (req, res) => {
    const { projectId, memberId } = req.params
    const { userId } = req.user._id

    const user = await User.findById(userId)

    if(!user) {
        throw new ApiError(400, "User not found for this project.")
    }

    if(user.role !== "admin" || user.role !== "project_admin"){
        throw new ApiError(
            403,
            "You are not authorized to add members to this project",
        );
    }

    const newProjectMember = await ProjectMember.create({
        project: projectId,
        user: memberId,
    });
    
    if(!newProjectMember) {
        throw new ApiError(400, "Project member creation failed");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            newProjectMember,
            "Add new member in project successfully."
        )
    )
})

const getProjectMembers = asyncHandler (async (req, res) => {
    const { projectId } = req.params
    
    if(!projectId) {
        throw new ApiError(404, "Project not found for this id.")
    }
    
    const projectMember = await ProjectMember.findById({
        project : projectId
    })
    
    if(!projectMember){
        throw new ApiError(401,"Project member is not found.")
    }
    
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            projectMember,
            "Project member fetched successfully."
        )
    )
})

const deleteMember = asyncHandler (async (req, res) => {
    const { memberId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId).select("role");
    if (user.role !== "admin" || user.role !== "project_admin") {
        throw new ApiError(
        403,
        "You are not authorized to delete members from this project",
        );
    }

    const deletedMember = await ProjectMember.findByIdAndDelete(memberId);

    if (!deletedMember) {
        throw new ApiError(404, "Member not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, "Member deleted", deletedMember));
})

const updateMemberRole = asyncHandler (async (req,res) => {
    const { memberId } = req.params
    const { role } = req.body
    const { userId } = req.user._id

    const user = await User.findById(userId).select("role");
    if (user.role !== "admin" || user.role !== "project_admin") {
      throw new ApiError(
        403,
        "You are not authorized to update role of this member",
      );
    }

    const updatedMember = await ProjectMember.findByIdAndUpdate(
        {
          _id: memberId,
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
  