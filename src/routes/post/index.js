import { Router } from "express";
import postController from "../../controllers/post/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import tokenService from "../../middleware/auth/checkTokenDb.js";
import postValidator from "../../validators/post/index.js";

const postRouter = Router();

postRouter.post(
  "/post/create",
  verifyToken,
  tokenService.checkTokenFromDb,
  postValidator.post,
  postController.createPost
);

postRouter.delete(
  "/post/delete/:id",
  verifyToken,
  tokenService.checkTokenFromDb,
  postController.deletePost
);

postRouter.post(
  "/post/like/:id",
  verifyToken,
  tokenService.checkTokenFromDb,
  postController.likeUnlikePost
);

postRouter.post(
  "/post/comment/:id",
  verifyToken,
  tokenService.checkTokenFromDb,
  postValidator.comment,
  postController.commentOnPost
);

postRouter.get(
  "/post/all",
  verifyToken,
  tokenService.checkTokenFromDb,
  postController.getAllPosts
);

postRouter.get(
  "/post/likes/:id",
  verifyToken,
  tokenService.checkTokenFromDb,
  postController.getLikedPosts
);

postRouter.get(
  "/post/following",
  verifyToken,
  postController.getFollowingPosts
);

postRouter.get(
  "/post/user/:username",
  verifyToken,
  postController.getUserPosts
);

export default postRouter;
