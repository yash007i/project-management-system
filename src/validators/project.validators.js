import { body } from "express-validator";

const projectCreateValidator = () => {
    return [
        body("name")
            .trim()
            .isEmpty().withMessage("Project name is required."),

        body("description")
            .isEmpty().withMessage("Project description is required.")
            .isLength({ min: 3 })
            .withMessage("Project description must be at least 3 characters long!")
            .isLength({ max: 220 })
            .withMessage("Project description must be at most 220 characters long!"),
    ]
}

export {
    projectCreateValidator,
}