// import { fileURLToPath } from 'url';
// Use fileURLToPath to get the current file path
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// dotenv.config({path:path.resolve(__dirname,"../../.env")})
import express from "express";
import dotenv from "dotenv"
import mongoose from "mongoose";
import connectDB from "./db/connectDB.js"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js";
import {v2 as cloudinary} from 'cloudinary'
const app=express()
dotenv.config()
const PORT=process.env.PORT || 5000
app.use(express.json({limit:'15mb'}))
app.use(express.urlencoded({limit:'10mb',extended:true})) //to parse form data into req.body (nested objects also parsed since it is true)
app.use(cookieParser())
cloudinary.config({
    cloud_name:process.env.cloudinary_cloudname,
    api_key:process.env.cloudinary_api_key,
    api_secret:process.env.cloudinary_api_secret
})
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes)
connectDB()
app.listen(PORT,()=>{
    console.log(`server running on port http://localhost:${PORT}`);
    
})