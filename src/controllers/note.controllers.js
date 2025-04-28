import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ProjectNote } from "../models/note.models.js"

const createProjectNote = asyncHandler (async (req, res) => {
    const { content } = req.body
    const { projectId } = req.params
    const user = req.user

    if(!content || !projectId){
        throw new ApiError(400,"Provide valid content for create note")
    }

    const newNote = await ProjectNote.create({
        content,
        project : projectId,
        createdBy : user._id,
    })

    if(!newNote) {
        throw new ApiError(400,"Error while createing a project note.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            newNote,
            "Project note create successfully"
        )
    )
})

const getProjectNotes = asyncHandler (async (req, res) => {
    const projectNotes = await ProjectNote.find()

    if(!projectNotes){
        throw new ApiError(404, "Project notes not found.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            projectNotes,
            "Project notes fetched successfully."
        )
    )
})

const getProjectNoteById = asyncHandler (async (req, res) => {
    const { noteId } = req.params

    const note = await ProjectNote.findById(noteId);

    if(!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            "Note fetched successfully",
            note
        )
    );
})

const updateProjectNote = asyncHandler (async (req, res) => {
    const { content } = req.body
    const { projectId, noteId } = req.params

    const updatedProjectNote = await ProjectNote.findByIdAndUpdate(
        {
            _id : noteId
        },
        {
            $set : {
                content,
                project : projectId,
            }
        },
        {
            new : true
        }
    )

    if(!updatedProjectNote){
        throw new ApiError(400, "Error while updating project note.")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            updatedProjectNote,
            "Project note updated successfully"
        )
    )
})

const deleteProjectNote = asyncHandler (async (req, res) => {
    const { noteId } = req.params

    const deletedProjectNote = await ProjectNote.findByIdAndDelete(noteId)

    if(!deletedProjectNote){
        throw new ApiError(400, "Error while deleteing project note")
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            deletedProjectNote,
            "Project delete successfully"
        )
    )
})

export {
    createProjectNote,
    getProjectNotes,
    getProjectNoteById,
    updateProjectNote,
    deleteProjectNote,
}