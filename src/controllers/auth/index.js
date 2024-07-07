import { hash, compare } from "bcrypt";
import userModel from "../../models/users/index.js";
import jwt from "jsonwebtoken";
import tokenModel from "../../models/token/index.js";

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
      console.log("Error in signup controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // check if username exists
      const userCheck = await userModel.findOne({ username });
      if (!userCheck) {
        return res.status(400).json({
          message: "User with this username doesnot exist",
        });
      }

      // check password
      const comparePassword = await compare(password, userCheck.password);
      if (!comparePassword) {
        return res.status(400).json({
          message: "Invalid password",
        });
      }

      const data = {
        id: userCheck.id,
        username: userCheck.username,
      };

      // generateTokenAndSetCookie(data, res);
      const token = jwt.sign(
        {
          data,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      // Save token in DB
      await tokenModel.create({ token });

      res
        .cookie("jwt", token, {
          httpOnly: true, // XSS attacks prevention
          // sameSite: "strict", // CSRF attacks prevention
        })
        .json({
          message: "User logged in successfully",
        });
    } catch (err) {
      console.log("Error in login Controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      token = token.replace("Bearer ", "");

      // delete token from db
      await tokenModel.deleteOne({ token });

      res.cookie("jwt", "").status(200).json({
        message: "Logged out successfully",
      });
    } catch (err) {
      console.log("Error in logout Controller", err.message);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

export default authController;
