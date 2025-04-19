import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { sendMail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent } from "../utils/sendMail.js"
import crypto from "crypto"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken =  user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave : false });

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong, while generated tokens");
    }
}

const registerUser = asyncHandler (async (req, res) => {
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

const loginUser = asyncHandler (async (req, res) => {

    // Follow below step :
    // req body -> data
    // username or email
    // find the user
    // email verification check
    // password check
    // access token and refresh token generated
    // generate cookie options
    // send a securely cookie 
    // send response

    const { email, password } = req.body;

    const user = await User.findOne({
        email
    });

    if(!user){
        throw new ApiError(400, "User not found, Please register first.")
    }

    if(!user.isEmailVerified) {
        throw new ApiError(401, "User is not verified, Please verify your self.")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User
    .findOne(user._id)
    .select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry -forgotPasswordToken -forgotPasswordExpiry");

    const options = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    }

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User loggin successfully."))
})

const verifyEmail = asyncHandler (async (req, res) => {
    const { token } = req.query;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        $and: [
        { emailVerificationToken: hashedToken },
        { emailVerificationExpiry: { $gt: Date.now() } },
        ],
    });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Email verified successfully"));
})

const logoutUser = asyncHandler (async (req, res) => {

})
export {
    registerUser,
    loginUser,
    verifyEmail,
    logoutUser
}