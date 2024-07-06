import { Router } from "express";
import authController from "../../controllers/auth/index.js";
import authValidator from "../../validators/auth/index.js";

const userRouter = Router();

userRouter.post("/user/signup", authValidator.signup, authController.signup);

userRouter.post("/user/login", authValidator.login, authController.login);

userRouter.get("/user/logout", authController.logout);

export default userRouter;
