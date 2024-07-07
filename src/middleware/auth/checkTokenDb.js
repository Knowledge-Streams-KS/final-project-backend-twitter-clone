import tokenModel from "../../models/token/index.js";

const checkTokenFromDb = async (req, res, next) => {
  try {
    let token = req.token;
    // Session compromised
    // How do i know? blacklisted token or report that token was stolen
    // We delete token from DB
    let tokenDB = await tokenModel.findOne({ token });
    if (!tokenDB) {
      // Logout of session
      console.log("logout");
    }
    // Send us email that token not found in DB
    // If we had deleted the token ourself then its what we wanted and if not that means
    // secret key is compromised or DB data is

    // If we check DB on every request it adds latency due to extra queries as application
    // scales it is non sustainable
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
