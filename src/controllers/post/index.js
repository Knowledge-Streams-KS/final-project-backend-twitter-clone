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
        await userModel.updateOne(
          { _id: userId },
          { $pull: { likedPosts: postId } }
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

        await userModel.updateOne(
          { _id: userId },
          { $push: { likedPosts: postId } }
        );

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
  getAllPosts: async (req, res) => {
    try {
      const posts = await postModel
        .find()
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password",
        })
        .populate({
          path: "comments.user",
          select: "-password",
        });

      if (posts.length === 0) {
        return res.status(200).json({
          data: [],
        });
      }

      res.status(200).json({
        data: posts,
      });
    } catch (err) {
      console.log("Error in getAllPosts controller", err.messgae);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  getLikedPosts: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      }

      // get me posts that are in users liked posts
      const likedPosts = await postModel
        .find({ _id: { $in: user.likedPosts } })
        .populate({
          path: "user",
          select: "-password",
        })
        .populate({
          path: "comments.user",
          select: "-password",
        });

      if (likedPosts.length === 0) {
        return res.status(200).json({
          data: [],
        });
      }

      res.status(200).json({
        data: likedPosts,
      });
    } catch (err) {
      console.log("Error in getLikedPosts controller", err.message);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
  getFollowingPosts: async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await userModel.findById(userId);
      if (!user) {
        return res.status(404).json({
          message: "user not found",
        });
      }

      let usersFollowing = user.following;

      //   const followingPosts = await postModel
      //     .find({ user: { $in: usersFollowing } })
      //     .populate({
      //       path: "user",
      //       select: "-password",
      //     })
      //     .populate({
      //       path: "comments.user",
      //       select: "-password",
      //     })
      //     .sort({ createdAt: -1 });

      // tried using forEach but due to async await it wasnt giving me the required results
      // so I had to resort to a for loop

      let followingPosts = [];

      for (let i = 0; i < usersFollowing.length; i++) {
        let user = usersFollowing[i];
        const posts = await postModel
          .find({ user })
          .populate({
            path: "user",
            select: "-password",
          })
          .populate({
            path: "comments.user",
            select: "-password",
          });

        posts.forEach((post) => {
          followingPosts.push(post);
        });
      }

      res.status(200).json({
        data: followingPosts,
      });
    } catch (err) {
      console.log("Error in getFollowingPosts controller", err.message);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  },
};

export default postController;
