import { ApiResponse } from "../utils/ApiResponse"

const healthCheck = (req,res) => {
    res.status(200).json(
        new ApiResponse(200, {message : "Server is running well!!."})
    );
}

export { healthCheck };