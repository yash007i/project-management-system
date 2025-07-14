import { body } from "express-validator";

const createTaskValidator = () => {
    return [
        body("title")
            .trim()
            .notEmpty()
            .isLength({min : 4}).withMessage("Task title must be min 4 char.")
            .isLength({max : 70}).withMessage("Task title not be more than 15 char."),
        body("description")
            .trim()
            .notEmpty()
            .isLength({min : 14}).withMessage("Task title must be min 14 char.")
            .isLength({max : 115}).withMessage("Task title not be more than 115 char."),
        
        body("attachments")
        .custom((_, { req }) => {
            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                throw new Error("At least one file is required.");
            }

            for (const file of req.files) {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    throw new Error("Each file must be less than 10MB.");
                }
            }

            return true;
        })
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