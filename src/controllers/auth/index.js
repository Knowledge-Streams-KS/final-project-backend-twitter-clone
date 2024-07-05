const authController = {
  signup: (req, res) => {
    res.json({
      message: "Signup API hit",
    });
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
