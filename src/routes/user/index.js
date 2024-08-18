import { Router } from "express";
import userController from "../../controllers/user/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import tokenService from "../../middleware/auth/checkTokenDb.js";
import userValidator from "../../validators/user/index.js";

const userRouter = Router();

userRouter.get(
  "/user/profile/:username",
  verifyToken,
  tokenService.checkTokenFromDb,
  userController.getUserProfile
);
userRouter.get(
  "/user/suggested",
  verifyToken,
  tokenService.checkTokenFromDb,
  userController.getSuggestedUsers
);
userRouter.post(
  "/user/follow/:id",
  verifyToken,
  tokenService.checkTokenFromDb,
  userController.followUnfollowUser
);
userRouter.post(
  "/user/update",
  verifyToken,
  tokenService.checkTokenFromDb,
  userValidator.updateProfile,
  userController.updateUser
);

export default userRouter;
