const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

class AuthMiddleware {
  static async isAuth(req, res, next) {
    try {
      const token =
        req.headers.authorization && req.headers.authorization.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized - no token provided" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      const currentUser = await User.findById(decoded.userId);

      if (!currentUser) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized - user with token not found",
        });
      }
      req.user = currentUser;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async isAdmin(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized - no user",
        });
      }

      if (req.user.role === "admin") {
        next();
      } else {
        res.status(401).json({
          success: false,
          error: "Unauthorized - user is not an admin",
        });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = AuthMiddleware;
