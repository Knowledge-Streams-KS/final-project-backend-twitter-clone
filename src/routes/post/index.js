import { Router } from "express";
import postController from "../../controllers/post/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";
import postValidator from "../../validators/post/index.js";

const postRouter = Router();

postRouter.post(
  "/post/create",
  verifyToken,
  checkTokenFromDb,
  postValidator.post,
  postController.createPost
);

postRouter.delete(
  "/post/delete/:id",
  verifyToken,
  checkTokenFromDb,
  postController.deletePost
);

postRouter.post(
  "/post/like/:id",
  verifyToken,
  checkTokenFromDb,
  postController.likeUnlikePost
);

postRouter.post(
  "/post/comment/:id",
  verifyToken,
  checkTokenFromDb,
  postValidator.comment,
  postController.commentOnPost
);

postRouter.get(
  "/post/all",
  verifyToken,
  checkTokenFromDb,
  postController.getAllPosts
);

postRouter.get(
  "/post/likes/:id",
  verifyToken,
  checkTokenFromDb,
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
