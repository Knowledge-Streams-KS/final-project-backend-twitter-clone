import tokenModel from "../../models/token/index.js";
import authController from "../../controllers/auth/index.js";
import sendEmail from "../../utils/email/index.js";
import userModel from "../../models/users/index.js";

let lock;
let blockAccessForAll;
let blocked = [];

const checkTokenFromDb = async (req, res, next) => {
  try {
    if (blockAccessForAll) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }
    if (blocked.include(req.user.username)) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }
    if (lock) {
      next();
    } else {
      // As long as lock is true(for 10 mins), token will not be checked from db
      // saving query time at expense of security
      lock = true;
      let mins10 = 600000;
      let token = req.token;
      let user = req.user;

      setTimeout(async () => {
        // Current Session compromised
        // How do i know? blacklisted token or report that token was stolen
        // We delete token from DB ourself

        let tokenDB = await tokenModel.findOne({ token });
        if (!tokenDB) {
          // Send us email that token not found in DB
          sendEmail(token);

          // If token is made with wrong data using hacked secret key
          const userCheck = await userModel.findOne(user.username);

          //set lock false
          lock = false;

          // Logout of session
          // If attacker using jwt from current session
          if (userCheck) {
            authController.logout(req, res);
            blocked.push("user.username");
          } else {
            //JWT secret compromised
            blockAccessForAll = true;
          }

          // If we had deleted the token ourself then its what we wanted and if not that means
          // secret key is compromised or DB data is inconsistent

          // If we check DB on every request it adds latency due to extra queries as application
          // scales it is non sustainable
        } else {
          lock = false;
        }
      }, 10000);
      next();
    }
  } catch (err) {
    console.log(
      "Something went wrong when token was confirmed in database",
      err.message
    );
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
export default checkTokenFromDb;
