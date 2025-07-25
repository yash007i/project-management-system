import { body } from "express-validator";
import { AvailableUserRoles } from "../utils/constants.js";

const projectCreateValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty().withMessage("Project name is required."),

        body("description")
            .notEmpty().withMessage("Project description is required.")
            .isLength({ min: 3 })
            .withMessage("Project description must be at least 3 characters long!")
            .isLength({ max: 220 })
            .withMessage("Project description must be at most 220 characters long!"),
    ]
}

const projectMemberRoleValidator = () => {
    return [
    body("role")
        .trim()
        .isIn(AvailableUserRoles)
        .withMessage("Role must be project_admin or member !"),
    ];
}

export {
    projectCreateValidator,
    projectMemberRoleValidator,
}