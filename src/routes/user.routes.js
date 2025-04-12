import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js"
import { userRegistrationValidator } from "../validators/user.validators.js";
import { validate } from "../middlewares/validator.middlewares.js";

const router = Router();

router.route("/register")
    .post(userRegistrationValidator(), validate, registerUser);

export default router