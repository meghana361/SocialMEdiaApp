import mongoose from "mongoose";

const postSchema=mongoose.Schema({
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    text: {
        type: String,
        maxLength: 500,
    },
    img: {
        type: String,
    },
    likes:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"User",
        required:true
    },
    replies:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            username:{
                type: String,
            },
            userProfilePic:{
                type:String
            },
            text:{
                type:String,
                required: true,
            },
            replies: [
                {
                    
                  userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                  },
                  username: {
                    type: String,
                  },
                  userProfilePic: {
                    type: String,
                  },
                  text: {
                    type: String,
                    required: true,
                  },likes: {
                    type: [mongoose.Schema.Types.ObjectId],
                    ref: "User",
                  },
                 replies:[]// Nested replies can continue this pattern for deeper levels
                },
              ],
        },
    ],
   
},
{timestamps:true}
);
const Post=mongoose.model("Post",postSchema);
export default Post;