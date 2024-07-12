import notificationModel from "../../models/notification/index.js";
import postModel from "../../models/posts/index.js";
import userModel from "../../models/users/index.js";
import { v2 as cloudinary } from "cloudinary";

const postController = {
  createPost: async (req, res) => {
    try {
      let { text, img } = req.body;
      let userId = req.user.id;

      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (!text && !img) {
        return res.status(400).json({
          message: "Post must have text or an image",
        });
      }

      if (img) {
        const uploadedresponse = await cloudinary.uploader.upload(img);
        img = uploadedresponse.secure_url;
      }

      const newPost = new postModel({
        user: user._id,
        text,
        img,
      });

      await newPost.save();

      res.status(201).json({
        data: newPost,
      });
    } catch (err) {
      console.log("Error in createpost contoller", err.message);
      res.status(500).json({
        message: "Interval Server Error",
      });
    }
  },
  deletePost: async (req, res) => {
    try {
      const id = req.params.id;

      const postToDelete = await postModel.findById(id);

      if (!postToDelete) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

      if (postToDelete.user.toString() !== req.user.id) {
        return res.status(401).json({
          message: "You are not authorized to delete this post",
        });
      }

      // delete post image from cloudinary
      if (postToDelete.img) {
        const imgId = postToDelete.img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(imgId);
      }

      // delete post from database
      await postModel.deleteOne({ _id: postToDelete._id });

      res.status(200).json({
        message: "Post deleted successfully",
      });
    } catch (err) {
      console.log("Error in  deletepost controller"), err.message;
      res.status(500).json({
        message: "Interval Server Error",
      });
    }
  },
  likeUnlikePost: async (req, res) => {
    try {
      const postId = req.params.id;
      const userId = req.user.id;
      const post = await postModel.findById(postId);

      if (!post) {
        return res.status(404).json({
          message: "Error: Post not found",
        });
      }

      const userLiked = post.likes.includes(userId);

      if (userLiked) {
        //unlike post
        await postModel.updateOne(
          { _id: postId },
          { $pull: { likes: userId } }
        );
        res.status(200).json({
          message: "Post unliked successfully",
        });
      } else {
        //like post and send notification to user
        await post.updateOne({ $push: { likes: userId } });
        //  alternate ways:
        // 1. await postModel.updateOne({_id: postId}, {$push: {likes: userId}})
        // 2. post.likes.push(userId) and post.save()

        if (userId !== post.user.toString()) {
          await notificationModel.create({
            from: userId,
            to: post.user,
            type: "like",
          });
        }

        res.status(200).json({
          message: "Post liked successfully",
        });
      }
    } catch (err) {
      console.log("Error in likeUnlike controller", err.message);
      res.status(500).json({
        message: "Interval Server Error",
      });
    }
  },
  commentOnPost: async (req, res) => {
    try {
      const { text } = req.body;
      const postId = req.params.id;
      const userId = req.user.id;

      const post = await postModel.findById(postId);

      if (!post) {
        res.status(404).json({
          message: "Post not found",
        });
      }

      let comment = { user: userId, text: text };

      post.comments.push(comment);

      await post.save();

      res.status(200).json({
        data: comment,
      });
    } catch (err) {
      console.log("Error in commentOnPost controller"), err.message;
      res.status(500).json({
        message: "Interval Server Error",
      });
    }
  },
};

export default postController;
