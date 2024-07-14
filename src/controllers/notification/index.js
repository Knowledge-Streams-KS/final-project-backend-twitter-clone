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
  deleteNotification: async (req, res) => {
    try {
    } catch (err) {
      console.log("Error in deleteNotification controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

export default notificationController;
