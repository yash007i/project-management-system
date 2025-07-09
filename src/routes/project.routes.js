import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { getProjects,
    createProject,
    getProjectById,
    updateProject,
    getProjectMembers,
    addMemberToProject,
    deleteMember,
    deleteProject,
    updateMemberRole,
 } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { projectCreateValidator, projectMemberRoleValidator } from "../validators/project.validators.js";

const router = Router();

router.route("/new-project").post(
    isLoggedIn,
    projectCreateValidator(),
    validate,
    createProject)

router.route("/get-projects").get(isLoggedIn, getProjects)
router.route("/get-project-by-id/:projectId").get(isLoggedIn, getProjectById)
router.route("/update-project/:projectId").put(
    isLoggedIn,
    projectCreateValidator(),
    validate,
    updateProject
)
router.route("/delete-project/:projectId").delete(isLoggedIn, deleteProject)


router.route("/project-member/:projectId").get(isLoggedIn,getProjectMembers)
router.route("/add-member/:projectId/:memberId").post(isLoggedIn, addMemberToProject)
router.route("/delete-member/:memberId").delete(isLoggedIn, deleteMember)
router.route("/update-role/:memberId").put(
    isLoggedIn,
    projectMemberRoleValidator,
    validate,
    updateMemberRole
)
export default router