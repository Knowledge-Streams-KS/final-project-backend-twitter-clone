import { Router } from "express";
import notificationController from "../../controllers/notification/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import tokenService from "../../middleware/auth/checkTokenDb.js";

const notificationRouter = Router();

notificationRouter.get(
  "/notification/",
  verifyToken,
  tokenService.checkTokenFromDb,
  notificationController.getNotification
);

notificationRouter.delete(
  "/notification/",
  verifyToken,
  tokenService.checkTokenFromDb,
  notificationController.deleteAllNotifications
);

notificationRouter.delete(
  "/notification/:id",
  verifyToken,
  tokenService.checkTokenFromDb,
  notificationController.deleteSingleNotification
);

export default notificationRouter;
