import { Router } from "express";
import postController from "../../controllers/post/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const postRouter = Router();

postRouter.post("/post/create", verifyToken, postController.createPost);

postRouter.delete("/post/delete/:id", verifyToken, postController.deletePost);

postRouter.post("/post/like/:id", verifyToken, postController.likeUnlikePost);

postRouter.post("/post/comment/:id", verifyToken, postController.commentOnPost);

postRouter.get("/posts", verifyToken, postController.getAllPosts);

export default postRouter;
