import express from "express";
import { deletePost,getFeedPosts,getPost,getUserPosts,likeUnlikePost,createPost,replyToPost ,nestedReply} from "../controllers/postController.js";
import protectedRoute from "../middlewares/protectedRoute.js";
const router=express.Router()
router.post("/create",protectedRoute,createPost)
router.get("/feed",protectedRoute,getFeedPosts)
router.get("/:id",getPost); 
router.put("/reply/:id",protectedRoute,replyToPost)
router.post('/:postId/reply/:replyId',protectedRoute,nestedReply);
router.delete("/:id",protectedRoute,deletePost)
router.put("/likeunlike/:id",protectedRoute,likeUnlikePost)
router.get("/user/:username",getUserPosts)
export default router;