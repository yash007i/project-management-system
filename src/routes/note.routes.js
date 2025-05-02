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

router.route("/note/new/:projectId")
.post(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    createProjectNote)

router.route("/note/get-all/:projectId")
.get(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    getProjectNotes)

router.route("/note/by-id/:noteId")
.get(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    getProjectNoteById)

router.route("/note/update/:noteId/:projectId")
.put(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    updateProjectNote)

router.route("/note/delete/:noteId")
.delete(isLoggedIn,
    validateProjectPermission([UserRolesEnum.ADMIN, UserRolesEnum.MEMBER]),
    deleteProjectNote)

export default router