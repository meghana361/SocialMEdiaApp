import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import generateTokenANDsetCookie from "../utils/generateTokenANDsetCookie.js";
import {v2 as cloudinary} from 'cloudinary'
import { sendVerificationMail,sendwelcomeEmail } from "../mailTrap/email.js";
const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    // const user=await User.findOne({username,email});
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken=Math.floor(100000+Math.random()*900000).toString()
    await sendVerificationMail(email,verificationToken)
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      verificationToken:verificationToken,
      verificationTokenExpiresAt:Date.now()+24*60*60*1000
    });
    await newUser.save();
    if (newUser) {
      generateTokenANDsetCookie(newUser._id, res);
      res.status(201).json({
        message: "successfully created",
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in signupUser: ", error.message);
  }
};
const verifyEmail=async()=>{
  try {
    const user=await User.findOne({
        verificationToken:code,
        verificationTokenExpiresAt:{$gt:Date.now()}
        
    })
if(!user){return res.status(400).json({success:false,message:"Invalid or expired verification code"})}
user.isVerified=true;
user.verificationToken=undefined;
user.verificationTokenExpiresAt=undefined;
await user.save()
await sendwelcomeEmail(user.email,user.name)
res.status(201).json({success:true,message:"Successfully verified",user:{
    ...user._doc,
    password:undefined
}})
}catch (error) {
  console.log("Error in verification",error.message);
  res.status(400).json({error:"Internal server error"})
}
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "invalid email or password" });
    }
    generateTokenANDsetCookie(user._id, res);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in loginUser: ", error.message);
  }
};
const logout = async (req, res) => {
  try {
    // Clear the JWT cookie by setting it to an empty value or maxAge to 0
    res.cookie("jwt", "", { expiresIn: new Date(0) }); // Expire immediately
    res.status(201).json({ message: "Logged-out successfully" });
  } catch (error) {
    res.status(500).json({ error: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};
const getUserProfile = async (req, res) => {
  const { query } = req.params;
  try {
    let user;
    if (mongoose.Types.ObjectId.isValid(query)) {
      user = await User.findOne({ _id: query })
        .select("-password")
        .select("-updatedAt");
    } else {
      user = await User.findOne({ username: query })
        .select("-password")
        .select("-updatedAt");
    }
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in getUserProfile: ", error.message);
  }
};
const followUnfollow = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findOne({ _id: id }); //here also sue same format to reduce obligations
    // Route setup using protectedRoute middleware
    // app.get('/profile', protectedRoute, (req, res) => {
    // Since the protectedRoute middleware has attached req.user, you can now access it here
    //     res.status(200).json({ user: req.user });
    // });
    const currentUser = await User.findOne({ _id: req.user._id }); //not (id) but use it like this

    console.log("req.user._id", req.user._id);
    //req.user._id new ObjectId('67172006fad594bdca13b76e') so need to convert to string and also id will always be in string format i sent from postman
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "you cannot follow/unfollow Yourself",error });
    }
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });
    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      //to unfollow user ,here req.user_id is the current user or user who is trying to unfollow another user that is id.
      //go to id that another userprfile and update followers by remoing currentuserid from thier profile
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
      //go to req.user_id that is my currentuserid and update following that is to remove that id from following
      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
      res.status(200).json({ message: "User Unfollowed successfully" });
    } else {
      //follow user
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log("Error in followUnFollowUser: ", err.message);
  }
};



const updateUser = async (req,res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;
  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });
    //insated of requenting id in body it is requseted in params
    if (req.params.id != userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile" });
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if(profilePic){
      if(user.profilePic){
        await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
        // const publicId = cloudinary.utils.extract_public_id(user.profilePic);

      }
      const uploadResponse=await cloudinary.uploader.upload(profilePic);
      profilePic=uploadResponse.secure_url
      console.log(uploadResponse)
    }
    user.name = name || user.name;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;
    user.bio = bio || user.bio;
    user.email=email||user.email
    user=await user.save();
    // Find all posts that this user replied and update username and userProfilePic fields
 
    user.password = null;
    //password should be null in response
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in updateUser: ", error.message);
  }
};
const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const usersFollwedByYou = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: { _id: { $ne: userId } },
      },
      {
        $sample: {
          size: 10,
        },
      },
    ]);
    //This line filters the sampled users to exclude any users that
    // the current user is already following. 
    //It uses the Array.prototype.filter() method to create a new array,
    // filteredUsers, which only contains users whose IDs are not in the following array of the current user.
    const filteredUsers = users.filter(
      (user) => !usersFollwedByYou.following.includes(user._id)
    );
    const suggestedUsers=filteredUsers.slice(0,6);
    //remove suggestedusers passowrd not display in response
    suggestedUsers.forEach((user)=>(user.password=null))
    res.status(200).json(suggestedUsers);
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
 const forgotPassword=async(req,res)=>{
  const {email}=req.body;
  try {
      const user=await User.findOne({email});
      if(!user){
          {return res.status(400).json({success:false,message:"user not found"})}
      }

      const resetToken=crypto.randomBytes(20).toString("hex");
      const resetTokenExpiresAt=Date.now()+1*60*60*1000; //one hr
      user.resetPasswordToken=resetToken;
      user.resetPasswordExpriesAt=resetTokenExpiresAt;
      await user.save();
      await sendPasswordResetEmail(user.email,`{$process.env.Clienturl}/reset-password/${resetToken}`)
      res.status(200).json({ success: true, message: "Password reset link sent to your email" });

  } catch (error) {
      console.log("Error in forgotpassword controller",error.message);
      res.status(400).json({error:"Internal server error"})
  }
}
const resetPassword = async (req, res) => {
  const {token}=req.params;
  const{password}=req.body;
  try{
  const user=await User.findOne({
      resetPasswordToken:token,
      resetPAsswordExpiresAt:{$gt:Date.now()}
  })
  if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  user.password=hashedPassword;
  user.resetPasswordToken=undefined;
  user.resetPasswordExpriesAt=undefined;
  await user.save();
   await sendResetSuccessEmail(user.email);
  res.status(200).json({ success: true, message: "Password reset successful"
      // user:{
      //     ...user._doc,
      //     password:undefined
      // }
  });
} 
  catch (error) {
  console.log("Error in resetPassword ", error);
  res.status(400).json({ success: false, message: error.message });
}
}
export { signup, login, logout, getUserProfile, followUnfollow ,getSuggestedUsers,updateUser,verifyEmail,forgotPassword,resetPassword};
