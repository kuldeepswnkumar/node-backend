import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullname:{
        type: String,
        trim: true,
        index:true,
    },
    avatar:{
        type: String, //Cloudinary url
        required: true
    },
    coverImage:{
        type: String
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"

        }
    ],
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    referenceToker:{
        type: String
    }
}, {
    timestamps: true
})

//Before data submit
UserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN-SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN-EXPIRY
        }
    )
}
UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN-SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN-EXPIRY
        }
    )
}


export const User = mongoose.Model("User", UserSchema)