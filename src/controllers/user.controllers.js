import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendMail,
        emailVerificationMailgenContent,
        forgotPasswordMailgenContent } from "../utils/sendMail.js"
const registerUser = asyncHandler(async (req, res) => {
    // Step to follow :
    // get the user data from frontend
    // validation - not empty --> done by validator & middleware 
    // check if user already exists : email, username
    // if avatar then upload in cloudinary 
    // create user object - create entry in DB
    // check for user creation
    // generate temp token for email verification useing generateTemporaryToken()
    // store hashed token and expiry in db
    // make verification url for email verification
    // send verification mail
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
    
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password,
        avatar : {
            url :avatar?.url || "",
            localPath : avatarLocalPath || ""
        }
    });
    
    if(!user){
        throw new ApiError(500, "Something went wrong, while creating a user.")
    }

    const { hasedToken,tokenExpiry,unHasedToken } = user.generateTemporaryToken()
    user.emailVerificationToken = hasedToken;
    user.emailVerificationExpiry = tokenExpiry;
    await user.save();

    //finding user with username and email
    const registerUser = await User.findOne(
        { _id: user._id },
        { username: 1, email: 1, fullname: 1 },
    );

    if (!registerUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    const verificationURL = `${process.env.BASEURL}/users/verify-email?token=${unHasedToken}`

    const isSendEmail = await sendMail({
        email : registerUser.email,
        subject : "Verify your email address",
        mailgenContent : emailVerificationMailgenContent (
            registerUser.username,
            verificationURL,
        ),
    });

    return res.status(201).json(
        new ApiResponse(200, registerUser, "User register successfully")
    )

})

export {
    registerUser,

}