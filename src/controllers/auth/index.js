const authController = {
  signup: (req, res) => {
    try {
      const payload = req.body;
      res.json({
        message: payload,
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  login: (req, res) => {
    res.json({
      message: "Login API hit",
    });
  },
  logout: (req, res) => {
    res.json({
      message: "Logout API hit",
    });
  },
};

export default authController;
