import { Router } from "express";
import authController from "../../controllers/auth/index.js";

const userRouter = Router();

userRouter.get("/users/signup", authController.signup);

userRouter.get("/users/login", authController.login);

userRouter.get("/users/logout", authController.logout);

export default userRouter;
