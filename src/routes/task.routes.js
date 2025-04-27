import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { createTaskValidator, } from "../validators/task.validators.js"
import { validate } from "../middlewares/validator.middlewares.js";
import { createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask
 } from "../controllers/task.controllers.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/new-task").post(
    isLoggedIn,
    upload.array("attachments",10),
    createTaskValidator(),
    validate,
    createTask
)
router.route("/update-task/:taskId").patch(
    isLoggedIn,
    upload.array("attachments",10),
    createTaskValidator(),
    validate,
    updateTask
)
router.route("/get-task").get(isLoggedIn, getTasks)
router.route("/get-task-by-id/:taskId").get(isLoggedIn, getTaskById)
router.route("/delete-task/:taskId").delete(isLoggedIn, deleteTask)

export default router