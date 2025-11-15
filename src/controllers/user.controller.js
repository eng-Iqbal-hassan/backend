import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

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

    // (4): As we have added files in our local using multer middleware so this req has the access of file as well

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath) {
        throw new apiError(400, "Avatar is Required");
    }

    // (5):

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar) {
       throw new apiError(400, "Avatar is Required"); 
    }

    // 6: 

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email, 
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    })

    // 7: 
    const createdUser = User.findById(user._id).select(
        "-password -refreshToken"
    )

    // 8:

    if(!createdUser) {
        throw new apiError(500,"something went wrong while registeriung user")
    }

    // 9: 

    return res.status(201).json(
        new apiResponse(200, createdUser, "User is registered successfully")
    )
 
}) 

export { registerUser };