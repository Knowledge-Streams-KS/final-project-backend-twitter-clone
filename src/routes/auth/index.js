import { Router } from "express";
import authController from "../../controllers/auth/index.js";
import authValidator from "../../validators/auth/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const userRouter = Router();

userRouter.post("/user/signup", authValidator.signup, authController.signup);

userRouter.post("/user/login", authValidator.login, authController.login);

userRouter.post("/user/logout", verifyToken, authController.logout);

userRouter.get("/user", verifyToken, checkTokenFromDb, authController.getUser);

export default userRouter;
