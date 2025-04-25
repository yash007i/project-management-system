import { Router } from "express";
import { registerUser,
    loginUser,
    verifyEmail, 
    logoutUser,
    getCurrentUser,
    refreshAccessToken,
    forgotPassword,
    resendEmailVerification} from "../controllers/user.controllers.js"
import { forgotPasswordValidator, userLoginValidator, userRegistrationValidator } from "../validators/user.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";
import { upload } from "../middlewares/multer.middleware.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.middleware.js"

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
router.route("/logout").get(isLoggedIn, logoutUser)
router.route("/get-user").get(isLoggedIn, getCurrentUser)
router.route("/refresh-token").get(refreshAccessToken)
router.route("/forgot-password").post(forgotPasswordValidator(), validate, forgotPassword)
router.route("/resend-email").get(resendEmailVerification)

export default router