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
        return res.status(400).json({
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
  deletePost: (req, res) => {
    try {
    } catch (err) {
      console.log("Error in  deletepost controller"), err.message;
      res.status(500).json({
        message: "Interval Server Error",
      });
    }
  },
  likeUnlikePost: (req, res) => {},
  commentOnPost: (req, res) => {},
};

export default postController;
