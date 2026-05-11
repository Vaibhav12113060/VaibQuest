const jwt = require("jsonwebtoken");

const User = require("../models/user.model");

/*
=====================================
PROTECT ROUTES
=====================================
*/

const protect = async (req, res, next) => {
  try {
    let token;

    /*
    Check Authorization Header
    */

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      /*
      Extract Token
      */

      token = req.headers.authorization.split(" ")[1];

      /*
      Verify Token
      */

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      /*
      Find User
      */

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      /*
      Attach User to Request
      */

      req.user = user;

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

/*
=====================================
ADMIN ACCESS ONLY
=====================================
*/

const adminOnly = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  protect,
  adminOnly,
};
