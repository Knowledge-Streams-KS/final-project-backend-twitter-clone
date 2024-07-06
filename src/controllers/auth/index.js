import { hash } from "bcrypt";
import userModel from "../../models/users/index.js";

const authController = {
  signup: async (req, res) => {
    try {
      const { fullName, username, email, password } = req.body;

      // check if user already exists
      const existingUser = await userModel.findOne({
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "User with this username or email already exists",
        });
      }

      // hash password
      const hpassword = await hash(password, 10);

      // save user in DB
      const user = await userModel.create({
        fullName,
        username,
        email,
        password: hpassword,
      });

      const createdUser = await userModel
        .findById(user._id)
        .select("-password ");

      if (!createdUser) {
        return res.status(500).json({
          message: "Something went wrong while registering the user",
        });
      }

      res.status(201).json({
        message: "User registered successfully",
        createdUser,
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
