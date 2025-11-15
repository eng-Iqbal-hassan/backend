import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res) => {
    // (1): get user detail from frontend
    // (2): Validation, fields are empty or not
    // (3): check if user already exists, username and email
    // (4): check for images, check for avatar
    // (5): Upload the images on cloudinary, avatar
    // (6): Create user object - create entry in db
    // (7): Remove password and refresh token from response
    // (8): check for user creation
    // (9): return response. 

    // (1): 
     const {username, email, fullname, password} = req.body;
     console.log("email", email);

    // Whenever the data will come from the frontend, it will come in req.body
    // In this way, we can take the data like username, email, fullname and password, but we can not take images in this way.
    // In short you can handle data in the json and not the file
    // We have added the middleware in the routes and just before registerUser. 

    // (2): 
    if(
        [username, email, fullname, password].some((field)=>field?.trim()==="")
    ) {
        throw new apiError(400,"All fields are required")
    }

    // (3): 
    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser) {
        throw new apiError(409, "User with email or username already exists.")
    }

}) 

export { registerUser };