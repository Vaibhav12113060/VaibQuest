const express = require("express");

const {
  joinQuest,
  submitQuest,
  getMyJoinedQuests,
  getLeaderboard,
  getQuestSubmissions,
  approveSubmission,
  rejectSubmission,
} = require("../controllers/userQuest.controller");

const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");
const validate = require("../middlewares/validator.middleware");
const {
  joinQuestValidator,
  submitQuestValidator,
  questIdParamValidator,
  mongoIdParamValidator,
  rejectSubmissionValidator,
} = require("../validators/userQuest.validator");

const router = express.Router();

/*
=====================================
USER ROUTES
=====================================
*/

/*
JOIN QUEST
*/

router.post("/join", protect, joinQuestValidator, validate, joinQuest);

/*
SUBMIT QUEST
*/

router.post(
  "/submit/:id",
  protect,
  upload.single("proofFile"),
  submitQuestValidator,
  validate,
  submitQuest,
);

/*
MY JOINED QUESTS
*/

router.get("/my-quests", protect, getMyJoinedQuests);

/*
LEADERBOARD
*/

router.get("/leaderboard", protect, getLeaderboard);

/*
=====================================
ADMIN ROUTES
=====================================
*/

/*
GET QUEST SUBMISSIONS
*/

router.get(
  "/submissions/:questId",
  protect,
  adminOnly,
  questIdParamValidator,
  validate,
  getQuestSubmissions,
);

/*
APPROVE SUBMISSION
*/

router.put(
  "/approve/:id",
  protect,
  adminOnly,
  mongoIdParamValidator,
  validate,
  approveSubmission,
);

/*
REJECT SUBMISSION
*/

router.put(
  "/reject/:id",
  protect,
  adminOnly,
  rejectSubmissionValidator,
  validate,
  rejectSubmission,
);

module.exports = router;
