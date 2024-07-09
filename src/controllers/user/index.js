import userModel from "../../models/users/index.js";
import notificationModel from "../../models/notification/index.js";

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
  followUnfollowUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (id === req.user.id) {
        return res.status(400).json({
          error: "You can't follow/unfollow yourself",
        });
      }
      const userToModify = await userModel.findById(id);
      const currentUser = await userModel.findById(req.user.id);

      if (!userToModify || !currentUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isFollowing = currentUser.following.includes(id);

      if (isFollowing) {
        // unfollow user
        await userModel.findByIdAndUpdate(id, {
          $pull: { followers: req.user.id },
        });
        await userModel.findByIdAndUpdate(req.user.id, {
          $pull: { following: id },
        });
        res.status(200).json({
          message: "User unfollowed successfully",
        });
      } else {
        // follow user

        await userModel.findByIdAndUpdate(id, {
          $push: { followers: req.user.id },
        });
        await userModel.findByIdAndUpdate(req.user.id, {
          $push: { following: id },
        });

        // send notification to the user

        const newNotification = new notificationModel({
          type: "follow",
          from: req.user.id,
          to: userToModify._id,
        });

        await newNotification.save();

        res.status(200).json({
          message: "User followed successfully",
        });
      }
    } catch (err) {
      console.log("Error in followUnfollowUser controller", err.message);
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  },
  getSuggestedUsers: async (req, res) => {
    try {
      const userId = req.user.id;

      //Find users followed by me
      const currentUserWithFollowing = await userModel
        .findById(userId)
        .select("following");

      const usersFollowedByMe = currentUserWithFollowing.following;

      // Users that donot include current user and have a sample size of 10
      const users = await userModel.aggregate([
        {
          $match: {
            _id: { $ne: currentUserWithFollowing._id },
          },
        },
        { $sample: { size: 10 } },
      ]);

      //Filter out users that are followed by current user
      const filteredUsers = users.filter((user) => {
        return !usersFollowedByMe.includes(user._id);
      });

      const suggestedUsers = filteredUsers.slice(0, 4);
      suggestedUsers.forEach((user) => (user.password = null));
      res.status(200).json({
        data: suggestedUsers,
      });
    } catch (err) {
      console.log("Error in getSuggestedUsers controller", err.message);
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  },
};

export default userController;
