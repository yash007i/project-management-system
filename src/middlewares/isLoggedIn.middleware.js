import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ProjectMember } from "../models/projectmember.models.js";
import dotenv from "dotenv";
dotenv.config();

const isLoggedIn = async (req, res, next) => {
    // Follow this step : 
    // find accessToken from req.cookies
    // check accessToken
    // verify token useing jwt verify
    // find user useing decoded token
    // store user in req
    // next();

    const {accessToken}  = req.cookies;
    
    if(!accessToken) {
        throw new ApiError(405, "Unauthorized user.");
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id)
        .select("-password -refreshToken");

        if(!user) {
            throw new ApiError(405, "User not found, Please register first.");
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error);        
        return next(
            new ApiError(401, "Invalid or expired access token.")
        )
    }
}

const validateProjectPermission = (roles = []) => asyncHandler (async (req,res,next) => {
    const { projectId } = req.params

    if(!projectId){
        throw new ApiError(404,"Project Not Found")
    }

    const project = await ProjectMember.findOne({
        $or: [
            { project: projectId },
            { user: req.user._id },
        ]
    });
    
    if(!project) {
        throw new ApiError(401, "Project is invalid")
    }

    const givenRole = project?.role

    req.user.role = givenRole

    if(!roles.includes(givenRole)){
        throw new ApiError(402, "You do not have permission to perform this action.")
    }
    next()
})

export {
    isLoggedIn,
    validateProjectPermission,
}