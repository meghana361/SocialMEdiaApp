import express from "express";
import protectedRoute from "../middlewares/protectedRoute.js";
import { signup,login,logout,getUserProfile,followUnfollow, getSuggestedUsers, updateUser} from "../controllers/userController.js";
import { verifyEmail ,forgotPassword} from "../controllers/userController.js";

const router=express.Router();
router.post("/signup",signup)
router.post("/verify_email",verifyEmail)
router.post("/login",login)
router.post("/logout",logout)
router.post("/forgot-password",forgotPassword)
router.get("/getUserProfile/:query",getUserProfile)
router.post("/followunfollow/:id",protectedRoute,followUnfollow)
router.get("/suggested",protectedRoute,getSuggestedUsers)
router.put("/update/:id",protectedRoute,updateUser)
export default router;