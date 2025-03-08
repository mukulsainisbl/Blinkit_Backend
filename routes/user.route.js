import { Router } from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  refreshToken,
  registerUserController,
  resetPassword,
  updateUserDetails,
  uploadAvtar,
  userDetails,
  verifyEmailController,
  verifyForgotPassword,
} from "../controllers/user.controller.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.put("/upload-avatar", auth, upload.single("avatar"), uploadAvtar);
userRouter.put("/update-user", auth, updateUserDetails);
userRouter.put("/forgot-password", forgotPasswordController); //Email Verification
userRouter.put("/verify-forget-password-otp", verifyForgotPassword); // verify  from MongoDB and time also
userRouter.put('/reset-password' , resetPassword)  // change the password
userRouter.post('/refresh-token' , refreshToken)
userRouter.get('/userDetails' , auth, userDetails)
export default userRouter;
