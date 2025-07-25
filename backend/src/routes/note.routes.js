import { Router } from "express";
import { createProjectNote,
    getProjectNotes,
    getProjectNoteById,
    updateProjectNote,
    deleteProjectNote
 } from "../controllers/note.controllers.js"
import { isLoggedIn, validateProjectPermission } from "../middlewares/isLoggedIn.middleware.js"
import { UserRolesEnum } from "../utils/constants.js";

const router = Router();

router.route("/new/:projectId")
.post(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    createProjectNote)

router.route("/get-all/:projectId")
.get(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    getProjectNotes)

router.route("/by-id/:noteId")
.get(isLoggedIn,
    getProjectNoteById)

router.route("/note/update/:noteId/:projectId")
.put(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    updateProjectNote)

router.route("/delete/:noteId")
.delete(isLoggedIn,
    deleteProjectNote)

export default router