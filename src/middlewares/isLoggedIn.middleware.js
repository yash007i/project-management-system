import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"

const isLoggedIn = async (req, res, next) => {
    // Follow this step : 
    // find accessToken from req.cookies
    // check accessToken
    // verify token useing jwt verify
    // find user useing decoded token
    // store user in req
    // next();

    const { accessToken } = req.cookies;

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
        return next(
            new ApiError(401, "Invalid or expired access token.")
        )
    }
}

export {
    isLoggedIn
}