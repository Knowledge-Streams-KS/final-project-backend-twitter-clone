import tokenModel from "../../models/token/index.js";
import sendEmail from "../../utils/email/index.js";
import userModel from "../../models/users/index.js";
import jwt from "jsonwebtoken";

const tokenDbMiddleware = () => {
  let lock = false;
  let blockAccessForAll = false;
  let blocked = [];
  let tokens = [];

  const checkTokenFromDb = async (req, res, next) => {
    try {
      if (blockAccessForAll) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      if (blocked.includes(req.user.username)) {
        return res.status(400).json({ message: "Unauthorized" });
      }

      if (!tokens.includes(req.token)) {
        tokens.push(req.token);
      }

      if (lock) {
        return next();
      }

      // As long as lock is true(for 10 mins), token will not be checked from db
      //   saving query time at expense of security

      lock = true;
      const mins10 = 600000;

      setTimeout(async () => {
        await processTokens();
        lock = false;
        tokens = [];
      }, mins10);

      next();
    } catch (err) {
      console.error("Error when checking token in database:", err.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const processTokens = async () => {
    for (const token of tokens) {
      try {
        const tokenDB = await tokenModel.findOne({ token });

        if (!tokenDB) {
          await handleTokenNotFound(token);
        }
      } catch (err) {
        console.error("Error when checking token in database:", err.message);
      }
    }
  };

  const handleTokenNotFound = async (token) => {
    // Current Session compromised
    //       How do i know? blacklisted token or report that token was stolen
    //       We delete token from DB ourself
    sendEmail(token);

    try {
      // If token is made with wrong data using hacked secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const username = decoded.username;
      const userCheck = await userModel.findOne({ username });

      // If attacker using jwt from current session
      // block the user and force him to login again
      if (userCheck) {
        blocked.push(username);
      } else {
        // JWT compromised
        blockAccessForAll = true;
      }

      // If we had deleted the token ourself then its what we wanted and if not that means
      // secret key is compromised or DB data is inconsistent

      // If we check DB on every request it adds latency due to extra queries as application
      // scales it is non sustainable
    } catch (err) {
      console.error("Error when checking token in database:", err.message);
    }
  };

  const getTokens = () => {
    return tokens;
  };

  return { checkTokenFromDb, getTokens };
};

const tokenService = tokenDbMiddleware();

export default tokenService;
// export { tokens };
