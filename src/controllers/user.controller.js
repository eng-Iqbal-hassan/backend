
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId); 

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (err) {
        throw new apiError(500, "Something went wrong while creating access and refresh token");
    }
};


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
    const { username, email, fullname, password } = req.body;
    console.log("email", email);

    // Normalized values (IMPORTANT FIX)
    const normalizedUsername = username?.toLowerCase().trim();
    const normalizedEmail = email?.toLowerCase().trim();

    // (2): 
    if (
        [normalizedUsername, normalizedEmail, fullname, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new apiError(400, "All fields are required");
    }

    // (3): 
    const existedUser = await User.findOne({
        $or: [
            { username: normalizedUsername },
            { email: normalizedEmail }
        ]
    });

    console.log("username emai",username, email)

    if (existedUser) {
        throw new apiError(409, "User with email or username already exists.");
    }

    // (4): As we have added files in our local using multer middleware so this req has the access of file as well

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar is Required");
    }

    // (5):
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new apiError(400, "Avatar is Required");
    }

    // 6: 
    const user = await User.create({
        fullname,
        username: normalizedUsername,
        email: normalizedEmail,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });

    // 7:  (FIXED: Added await)
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    // 8:
    if (!createdUser) {
        throw new apiError(500, "something went wrong while registeriung user");
    }

    // 9: 
    return res.status(201).json(
        new apiResponse(200, createdUser, "User is registered successfully")
    );

});

const loginUser = asyncHandler(async(req,res) => {
    // (1): req body --> data
    // (2): username or email base login 
    // (3): check user
    // (4): check password
    // (5): access token and refresh token
    // (6): send token in access token and refresh token
    // (7): send tokens in cookies.

    const {username, email, password} = req.body;

    if(!username && !email) {
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user) {
        throw new apiError(404,"User does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new apiError(404,"Invalid Credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedinUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200,
            {
                user: loggedinUser, accessToken, refreshToken
            }, 
            "user is loggedIn successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req,res) => {
    await User.findByIdAndUpdate(req.user?._id, {
        $set: {refreshToken: undefined}
    }, {
        new: true,
    })

    const options= {
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json( new apiResponse(200, {}, "User is loggedOut successfully") )
})

export { registerUser, loginUser, logoutUser };
