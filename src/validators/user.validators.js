import { body } from "express-validator";

const userRegistrationValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Email is Invalid."),
        
        body("username")
            .trim()
            .notEmpty().withMessage("Username is required.")
            .isLength({min : 3}).withMessage("Username should be at least minimum 3 length.")
            .isLength({max : 13}).withMessage("Username can not be maximum 13 char."),
        
        body("password")
            .notEmpty().withMessage("Password is required.")
            .isLength({min : 3}).withMessage("Password should be at least minimum 3 length."),
        
        body("fullname")
            .trim()
            .notEmpty().withMessage("Fullname is required.")
            .isLength({min : 3}).withMessage("Fullname should be at least minimum 3 length.")
            .isLength({max : 23}).withMessage("Fullname can not be maximum 23 char.")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty().withMessage("Email is required.")
            .isEmail().withMessage("Email is Invalid."),
        body("password")
            .notEmpty().withMessage("Password is required.")
            .isLength({min : 3}).withMessage("Password should be at least minimum 3 length.")
    ]
}

export { userRegistrationValidator, userLoginValidator }