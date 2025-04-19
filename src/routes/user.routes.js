import { Router } from "express";
import { registerUser,
    loginUser,
    verifyEmail } from "../controllers/user.controllers.js"
import { userLoginValidator, userRegistrationValidator } from "../validators/user.validators.js";
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
router.route("/verify-email").get(verifyEmail);
router.route("/login").post(userLoginValidator(), validate, loginUser)

export default router