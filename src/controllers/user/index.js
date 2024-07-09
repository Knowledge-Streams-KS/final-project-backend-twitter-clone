import { hash, compare } from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
//models import
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
  updateUser: async (req, res) => {
    try {
      const {
        fullName,
        username,
        email,
        currentPassword,
        newPassword,
        bio,
        link,
      } = req.body;
      let { profileImg, coverImg } = req.body;
      const userId = req.user.id;

      let user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (
        (!newPassword && currentPassword) ||
        (!currentPassword && newPassword)
      ) {
        return res.status(400).json({
          message: "Please provide both current and new password",
        });
      }

      if (currentPassword && newPassword) {
        const isMatch = await compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({
            message: "Current password is incorrect",
          });
        }
        user.password = await hash(newPassword, 10);
      }

      if (profileImg) {
        if (user.profileImg) {
          await cloudinary.uploader.destroy(
            user.profileImg.split("/").pop().split(".")[0]
          );
        }

        const uploadedresponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedresponse.secure_url;
      }

      if (coverImg) {
        if (user.coverImg) {
          await cloudinary.uploader.destroy(
            user.coverImg.split("/").pop().split(".")[0]
          );
        }

        const uploadedresponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedresponse.secure_url;
      }

      if (fullName) {
        user.fullName = fullName;
      }

      if (email) {
        user.email = email;
      }

      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.link = link || user.link;
      user.profileImg = profileImg || user.profileImg;
      user.coverImg = coverImg || user.coverImg;

      user = await user.save();

      // password should be null in response
      user.password = null;

      return res.status(200).json({
        data: user,
      });
    } catch (err) {
      console.log("Error in updateUser controller", err.message);
      res.status(500).json({
        message: "Internal Server error",
      });
    }
  },
};

export default userController;
