import { Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"
import { createTaskValidator, subTaskValidator, } from "../validators/task.validators.js"
import { validate } from "../middlewares/validator.middlewares.js";
import { createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
    createSubTask,
    updateSubTask,
    deleteSubTask,
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

router.route("/sub-task/new").post(isLoggedIn,
    subTaskValidator(),
    validate,
    createSubTask
)
router.route("/sub-task/update/:subTaskId").put(isLoggedIn, updateSubTask)
router.route("/sub-task/delete/:subTaskId").delete(isLoggedIn, deleteSubTask)

export default router