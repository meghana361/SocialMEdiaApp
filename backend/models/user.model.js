import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
    profilePic: {
        type: String,
        default: "",
    },
    followers:{
        type:[String],
        default:[]
    },
    following: {
        type: [String],
        default: [],
    },
    bio: {
        type: String,
        default: "",
    },
    lastLogin:{
type:Date,
default:Date.now
    },
    isVerified:{
type:Boolean,
default:false
    },
    isFrozen: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken:String,
    resetPasswordExpriesAt:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
},
{
timestamps:true});
const User=mongoose.model('User',userSchema);
export default User;