import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
    // Step to follow
    // get the user data from frontend
    // validation - not empty --> done by validator & middleware 
    // check if user already exists : email, username
    // create user object - create entry in DB  
    // remove password and refresh token filed from response
    // check for user creation
    // return response 

    // get the user data from frontend
    const { email, fullname, password, username} = req.body;

    // check if user already exists : email
    const existedUser = await User.findOne({
        email
    });

    if(existedUser){
        throw new ApiError(409, "User is alredy exist with this email.");
    }
    
    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase()
    });
    
    if(!user){
        throw new ApiError(500, "Something went wrong, while creating a user.")
    }

    const createdUser = user.select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User rigister successfully")
    )

})

export {
    registerUser,

}