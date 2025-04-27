import { body } from "express-validator";

const createTaskValidator = () => {
    return [
        body("title")
            .trim()
            .isEmpty()
            .isLength({min : 4}).withMessage("Task title must be min 4 char.")
            .isLength({max : 15}).withMessage("Task title not be more than 15 char."),
        body("description")
            .trim()
            .isEmpty()
            .isLength({min : 14}).withMessage("Task title must be min 14 char.")
            .isLength({max : 115}).withMessage("Task title not be more than 115 char."),
    ]
}

const subTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .withMessage("Title is Required !")
            .isLength({ min: 3 })
            .withMessage("Title must be at least 3 characters long !"),
        body("taskId")
            .trim()
            .notEmpty()
            .withMessage("Task is Required !"),
    ];
};

export {
    createTaskValidator,
    subTaskValidator,
}