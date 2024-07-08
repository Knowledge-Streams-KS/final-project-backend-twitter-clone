import userModel from "../../models/users/index.js";

const userController = {
  getUserProfile: async (req, res) => {
    try {
      const { username } = req.params;
      const user = await userModel.findOne({ username }).select("-password");
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        data: user,
      });
    } catch (err) {
      console.log("Error in getUserProfile controller", err.message);
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  },
};

export default userController;
