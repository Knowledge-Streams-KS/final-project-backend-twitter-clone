import { Router } from "express";
import postController from "../../controllers/post/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const postRouter = Router();

postRouter.post("/post/create", verifyToken, postController.createPost);

postRouter.delete("/post/delete/:id", verifyToken, postController.deletePost);

postRouter.post("/post/like/:id", verifyToken, postController.likeUnlikePost);

postRouter.post("/post/comment/:id", verifyToken, postController.commentOnPost);

postRouter.get("/post/all", verifyToken, postController.getAllPosts);

postRouter.get("/post/likes/:id", verifyToken, postController.getLikedPosts);

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
