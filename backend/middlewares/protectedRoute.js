import jwt from "jsonwebtoken"
import User from "../models/user.model.js";
import dotenv from "dotenv"
dotenv.config()
const protectedRoute=async(req,res,next)=>{
    try {
        
   
const token=req.cookies.jwt;
if(!token){
    return res.status(401).json({ message: "Unauthorized" });

}
const decoded=jwt.verify(token,process.env.jwtSecretKey);
const { userId } = decoded; //since i was getting  Parameter "filter" to findOne() must be an object, got "67172f3103fa5efce4ae4f00" (type string) i changed this
console.log(decoded);

const user=await User.findOne({_id:userId}).select("-password") //not decoded.userid but _id:userId convert it to id always
req.user=user;
next();
} catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUser: ", err.message);
}
}
export default protectedRoute;