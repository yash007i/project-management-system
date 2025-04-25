import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { getProjects,
    createProject,
    getProjectById,
 } from "../controllers/project.controllers.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { projectCreateValidator } from "../validators/project.validators.js";

const router = Router();

router.route("/new-project").post(
    isLoggedIn,
    projectCreateValidator(),
    validate,
    createProject)

router.route("/get-projects").post(isLoggedIn, getProjects)
router.route("/get-project-by-id/:projectId").get(isLoggedIn, getProjectById)

export default router