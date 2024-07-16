import { Router } from "express";
import notificationController from "../../controllers/notification/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const notificationRouter = Router();

notificationRouter.get(
  "/notification/",
  verifyToken,
  checkTokenFromDb,
  notificationController.getNotification
);

notificationRouter.delete(
  "/notification/",
  verifyToken,
  checkTokenFromDb,
  notificationController.deleteAllNotifications
);

notificationRouter.delete(
  "/notification/:id",
  verifyToken,
  checkTokenFromDb,
  notificationController.deleteSingleNotification
);

export default notificationRouter;
