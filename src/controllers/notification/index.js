import notificationModel from "../../models/notification/index.js";

const notificationController = {
  getNotification: async (req, res) => {
    try {
      const userId = req.user.id;

      const notifications = await notificationModel
        .find({ to: userId })
        .populate({
          path: "from",
          select: "username profileImg",
        });

      await notificationModel.updateMany({ to: userId }, { read: true });

      res.status(200).json({
        data: notifications,
      });
    } catch (err) {
      console.log("Error in getNotification controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  deleteAllNotifications: async (req, res) => {
    try {
      const userId = req.user.id;
      await notificationModel.deleteMany({ to: userId });

      res.status(200).json({
        message: "Notifications deleted successfully",
      });
    } catch (err) {
      console.log("Error in deleteAllnotifications controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  deleteSingleNotification: async (req, res) => {
    try {
      const userId = req.user.id;
      const notificationId = req.params.id;
      const notification = await notificationModel.findById(notificationId);

      if (!notification) {
        return res.status(404).json({
          error: "Notification Not found",
        });
      }

      await notificationModel.deleteOne({ notificationId });
      res.status(200).json({
        message: "Notification deleted successfully",
      });
    } catch (err) {
      console.log("Error in deleteSinglenotification controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

export default notificationController;
