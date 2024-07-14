import tokenModel from "../../models/token/index.js";
import sendEmail from "../../utils/email/index.js";
import userModel from "../../models/users/index.js";
import jwt from "jsonwebtoken";

let lock;
let blockAccessForAll;
let blocked = [];
let tokens = [];

const checkTokenFromDb = async (req, res, next) => {
  try {
    if (blockAccessForAll) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }
    if (blocked.includes(req.user.username)) {
      return res.status(400).json({
        message: "Unauthorized",
      });
    }
    if (!tokens.includes(req.token)) {
      tokens.push(req.token);
    }
    if (lock) {
      next();
    } else {
      // As long as lock is true(for 10 mins), token will not be checked from db
      // saving query time at expense of security
      lock = true;
      let mins10 = 600000;

      setTimeout(async () => {
        // Current Session compromised
        // How do i know? blacklisted token or report that token was stolen
        // We delete token from DB ourself

        tokens.forEach(async (token) => {
          let tokenDB = await tokenModel.findOne({ token });
          if (!tokenDB) {
            // Send us email that token not found in DB
            sendEmail(token);

            // If token is made with wrong data using hacked secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            let username = decoded.username;

            const userCheck = await userModel.findOne({ username });

            // If attacker using jwt from current session
            if (userCheck) {
              blocked.push(username);
            } else {
              //JWT secret compromised
              blockAccessForAll = true;
            }

            // If we had deleted the token ourself then its what we wanted and if not that means
            // secret key is compromised or DB data is inconsistent

            // If we check DB on every request it adds latency due to extra queries as application
            // scales it is non sustainable
          }
        });

        lock = false;
      }, mins10);

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
