const postController = {
  createPost: (req, res) => {
    try {
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
