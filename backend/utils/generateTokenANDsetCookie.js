import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const generateTokenANDsetCookie=(userId,res)=>{
const token=jwt.sign({userId},process.env.jwtSecretKey,{
    expiresIn:"15d"
});
res.cookie("jwt",token,{
    httpOnly:true,
    maxAge: 15 * 24 * 60 * 60 * 1000,//15d
    sameSite:"strict"//CSRF
})
return token;
}
export default generateTokenANDsetCookie;