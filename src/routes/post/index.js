import { Router } from "express";
import postController from "../../controllers/post/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const postRouter = Router();

postRouter.post("/post/create", postController.createPost);

postRouter.delete("/post/delete", postController.deletePost);

postRouter.post("/post/like/:id", postController.likeUnlikePost);

postRouter.post("/post/comment/:id", postController.commentOnPost);

export default postRouter;
