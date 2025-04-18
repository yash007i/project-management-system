import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js"
import { userRegistrationValidator } from "../validators/user.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = Router();

router.route("/register")
    .post(
    upload.fields(
        [
            {
                name : "avatar",
                maxCount : 1
            }
        ]
    ),
    userRegistrationValidator(),
    validate,
    registerUser);
router.route("/verify-email:token")
    .post(userRegistrationValidator(), validate, registerUser);

export default router