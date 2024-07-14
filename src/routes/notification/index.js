import { Router } from "express";
import notificationController from "../../controllers/notification/index.js";
import verifyToken from "../../middleware/auth/verifyToken.js";
import checkTokenFromDb from "../../middleware/auth/checkTokenDb.js";

const notificationRouter = Router();

notificationRouter.get(
  "/notification/",
  verifyToken,
  notificationController.getNotification
);

notificationRouter.delete(
  "/notification/",
  verifyToken,
  notificationController.deleteAllNotifications
);

notificationRouter.delete(
  "/notification/:id",
  verifyToken,
  notificationController.deleteSingleNotification
);

export default notificationRouter;
