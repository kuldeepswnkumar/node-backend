import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.models.js'
import { uploadFileOnCloudinay } from '../utils/fileUpload.js'
import { ApiResponse } from '../utils/ApiResponce.js'

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists: username, email
    //check for images, check for avatar
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field from response
    //check for user creation
    //return res

    const { fullName, email, username, password } = req.body

    // console.log("Body", req.body);

    //validation - not empty
    //First Method
    if (fullName === "") {
        throw new ApiError(400, "Name is required!!")
    }
    if (email === "") {
        throw new ApiError(400, "Email is required!!")
    }
    if (username === "") {
        throw new ApiError(400, "Nsername is required!!")
    }
    if (password === "") {
        throw new ApiError(400, "Password is required!!")
    }

    //Second Method
    // if (
    //     [fullName, email, username, password].some(() =>
    //         field?.trim() === ''
    //     ){
    //         throw new ApiError(400, 'All Fields are required!!')
    // }
    // )


    //check if user already exists in database: username, email
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    //check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage)
        && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }


    // console.log("Files", req.files);

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required!!")
    }

    //upload them to cloudinary, avatar
    const avatar = await uploadFileOnCloudinay(avatarLocalPath)
    const coverImage = await uploadFileOnCloudinay(coverImageLocalPath)



    if (!avatar) {
        throw new ApiError(400, "Avatar file is required!!")
    }

    //create user object - create entry in db
    const user = await User.create({
        fullName,
        username,
        avatar: avatar.url,
        //Validate coverImage
        coverImage: coverImage?.url || "",
        email,
        password: username.toLowerCase()
    })

    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToker"
    )

    // console.log("User", createdUser);

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered!! ")
    )

})

export { registerUser }