const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const TokenBlacklist = require("../models/tokenblacklist.model");

/**
 * @name authUser
 * @description validates the jwt token to authorize, sets req.user
 */
async function authUser(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      // throw in an async middleware doesn't reach Express error handlers
      // Express doesn't catch thrown errors from async functions unless you explicitly pass them to next(). 
      // So throw new ApiError(401, "token not provided") will cause an unhandled rejection, not a proper error response.
      return res.status(401).json({
        message: "token not provided",
      });
    }

    // check if token is blacklisted
    const TokenBlacklisted = await TokenBlacklist.findOne({ token });

    if (TokenBlacklisted) {
      return res.status(401).json({
        message: "invalid token",
      });
    }

    // verify can throw error
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    
  } catch (error) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
}

module.exports = authUser;
