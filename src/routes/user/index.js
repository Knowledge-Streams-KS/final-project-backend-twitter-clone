import { Router } from "express";
import userController from "../../controllers/user/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";
import userValidator from "../../validators/user/index.js";

const userRouter = Router();

userRouter.get(
  "/user/profile/:username",
  verifyToken,
  checkTokenFromDb,
  userController.getUserProfile
);
userRouter.get(
  "/user/suggested",
  verifyToken,
  checkTokenFromDb,
  userController.getSuggestedUsers
);
userRouter.post(
  "/user/follow/:id",
  verifyToken,
  checkTokenFromDb,
  userController.followUnfollowUser
);
userRouter.post(
  "/user/update",
  verifyToken,
  checkTokenFromDb,
  userValidator.updateProfile,
  userController.updateUser
);

export default userRouter;
