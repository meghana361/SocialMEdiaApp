import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import {v2 as cloudinary} from 'cloudinary'
const createPost = async (req, res) => {
  try {
    const {text } = req.body;
    let { img } = req.body;
    const postedBy=req.user._id;
    if (!text)
      return res
        .status(400)
        .json({ error: "Postedby and text fields are required" });
    const user = await User.findById(postedBy);
    if (!user) return res.status(404).json({ error: "User not found" });
    const maxLength = 500;
    if (text.length > maxLength)
      return res
        .status(400)
        .json({ error: `Text must be less than ${maxLength} characters` });
      
          if(img){
            // await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            // const publicId = cloudinary.utils.extract_public_id(user.profilePic);
    
          
          const uploadResponse=await cloudinary.uploader.upload(img);
          img=uploadResponse.secure_url
          console.log(uploadResponse)
        }
    const newPost = new Post({
      postedBy,
      text, 
      img:img,
    });
    await newPost.save()

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
};
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: "Unauthorized to remove post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const likeUnlikePost = async (req,res) => {
  try {
    //const { id: postId } = req.params; u can do like this also
    const postid  = req.params.id;
    const userId = req.user._id;
    const post = await Post.findById(postid);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const userLikedPost = post.likes.includes(userId);
    if (userLikedPost) {
      await Post.updateOne({ _id: postid }, { $pull: { likes: userId } });
      res.status(200).json({ message: "Post unliked successfully" });
    } else {
      await Post.updateOne({ _id: postid }, { $push: { likes: userId } });
      res.status(200).json({ message: "Post liked successfully" });
    }
    //post.likes.push(userId);
    //or post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    //await post.save()
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;

    const userId = req.user._id;
    const userProfilePic = req.user.profilePic;
    const username = req.user.username;
    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const reply = {
        userId, 
        username,
        userProfilePic,
        text
         };
    const result = await Post.updateOne(
      { _id: postId },
      { $push: { replies: reply } }
    );
    // /if (result.nModified === 0) {
    //   return res.status(404).json({ error: "Post not found or no update made" });
    // }
    res.status(200).json({ message: "Reply added successfully", result});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const following = user.following;
    const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({
      createdAt: -1,
    });
    res.status(200).json(feedPosts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUserPosts = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: user._id }).sort({
      createdAt: -1,
    });
//     const posts = await Post.aggregate([
//   { $match: { postedBy: user._id } },
//   { $sort: { createdAt: -1 } }
// ]);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const nestedReply=async(req,res)=>{
  const {postId,replyId}=req.params;
  const userId = req.user._id;
  const{text}=req.body;
  const userProfilePic = req.user.profilePic;
  const username = req.user.username;
  try{
    const post=await Post.findById({_id:postId})
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const parentReply=post.replies.find(reply=>reply._id.toString()===replyId)

    if (!parentReply) {
      return res.status(404).json({ message: 'Reply not found' });
    }
    const newNestedReply = {
      userId,
      username,
      userProfilePic,
      text,
      likes: [],
      replies: [],
    };
    parentReply.replies.push(newNestedReply);
    await post.save();

    res.status(200).json({ message: 'Nested reply added successfully', post,newNestedReply });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  


export {
  getFeedPosts,
  getUserPosts,
  getPost,
  createPost,
  replyToPost,
  deletePost,
  likeUnlikePost,
  nestedReply
};
