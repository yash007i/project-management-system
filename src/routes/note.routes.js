import { Router } from "express";
import { createProjectNote,
    getProjectNotes,
    getProjectNoteById,
    updateProjectNote,
    deleteProjectNote
 } from "../controllers/note.controllers.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"

const router = Router();

router.route("/note/new").post(isLoggedIn, createProjectNote)
router.route("/note/get-all").get(isLoggedIn, getProjectNotes)
router.route("/note/by-id/:noteId").get(isLoggedIn, getProjectNoteById)
router.route("/note/update/:noteId/:projectId").put(isLoggedIn, updateProjectNote)
router.route("/note/delete/:noteId").delete(isLoggedIn, deleteProjectNote)

export default router