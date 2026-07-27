const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser,
  getMyProfile,
  getAllUsers,
  getUserProfileByAdmin,
  changeProfilePicture,
  changePassword,
} = require("../controllers/auth.controller");

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");
const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
} = require("../validators/auth.validator");
const validate = require("../middlewares/validator.middleware");
const cacheMiddleware = require("../middlewares/cache.middleware").default;
const { invalidateCache } = require("../middlewares/invalidation.middleware");
const { default: rateLimiter } = require("../middlewares/ratelimit");

console.log("RateLimiter ->", rateLimiter);

const router = express.Router();

/*
=====================================
PUBLIC ROUTES
=====================================
*/

/*
REGISTER USER
*/

router.post(
  "/register",
  rateLimiter,
  registerValidator,
  validate,
  registerUser,
);

/*
LOGIN USER
*/

// router.post("/login", rateLimiter, loginValidator, validate, loginUser);

router.post(
  "/login",
  (req, res, next) => {
    // console.log("LOGIN ROUTE HIT");
    next();
  },
  rateLimiter,
  loginValidator,
  validate,
  loginUser,
);

/*
=====================================
USER ROUTES
=====================================
*/

/*
GET CURRENT USER
*/

router.get("/me", protect, getCurrentUser);

/*
GET MY PROFILE
*/

router.get("/profile", protect, cacheMiddleware, getMyProfile);

/*
CHANGE PROFILE PICTURE
*/

router.put(
  "/profile/change-avatar",
  rateLimiter,
  protect,
  invalidateCache({
    keys: (req) => [`${req.baseUrl}/profile:${req.user._id.toString()}`],
  }),
  upload.single("avatar"),
  changeProfilePicture,
);

/*
CHANGE PASSWORD
*/

router.put(
  "/profile/change-password",
  rateLimiter,
  protect,
  changePasswordValidator,
  validate,
  invalidateCache({
    keys: (req) => [`${req.baseUrl}/profile:${req.user._id.toString()}`],
  }),
  changePassword,
);

/*
=====================================
ADMIN ROUTES
=====================================
*/

/*
GET ALL USERS
*/

router.get("/users", protect, adminOnly, cacheMiddleware, getAllUsers);

/*
GET SINGLE USER PROFILE
*/

router.get(
  "/user/:userId",
  protect,
  adminOnly,
  cacheMiddleware,
  getUserProfileByAdmin,
);

module.exports = router;
