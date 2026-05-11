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

const router = express.Router();

/*
=====================================
PUBLIC ROUTES
=====================================
*/

/*
REGISTER USER
*/

router.post("/register", registerValidator, validate, registerUser);

/*
LOGIN USER
*/

router.post("/login", loginValidator, validate, loginUser);

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

router.get("/profile", protect, getMyProfile);

/*
CHANGE PROFILE PICTURE
*/

router.put(
  "/profile/change-avatar",
  protect,
  upload.single("avatar"),
  changeProfilePicture,
);

/*
CHANGE PASSWORD
*/

router.put(
  "/profile/change-password",
  protect,
  changePasswordValidator,
  validate,
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

router.get("/users", protect, adminOnly, getAllUsers);

/*
GET SINGLE USER PROFILE
*/

router.get("/user/:userId", protect, adminOnly, getUserProfileByAdmin);

module.exports = router;
