import { Router } from "express";
import authController from "../../controllers/auth/index.js";
import authValidator from "../../validators/auth/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const authRouter = Router();

authRouter.post("/auth/signup", authValidator.signup, authController.signup);

authRouter.post("/auth/login", authValidator.login, authController.login);

authRouter.post("/auth/logout", verifyToken, authController.logout);

authRouter.get(
  "/auth/currentUser",
  verifyToken,
  checkTokenFromDb,
  authController.getCurrentUser
);

export default authRouter;
