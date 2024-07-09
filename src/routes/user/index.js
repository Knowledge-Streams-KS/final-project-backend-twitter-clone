import { Router } from "express";
import userController from "../../controllers/user/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const userRouter = Router();

userRouter.get(
  "/user/profile/:username",
  verifyToken,
  userController.getUserProfile
);
userRouter.get("/user/suggested");
userRouter.post(
  "/user/follow/:id",
  verifyToken,
  userController.followUnfollowUser
);
userRouter.post("/user/update");

export default userRouter;