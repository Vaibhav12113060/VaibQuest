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

const cacheMiddleware = require("../middlewares/cache.middleware").default;
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { invalidateCache } = require("../middlewares/invalidation.middleware");
const { upload } = require("../config/cloudinary");
const validate = require("../middlewares/validator.middleware");
const {
  joinQuestValidator,
  submitQuestValidator,
  questIdParamValidator,
  mongoIdParamValidator,
  rejectSubmissionValidator,
} = require("../validators/userQuest.validator");
const { default: rateLimiter } = require("../middlewares/ratelimit");

const router = express.Router();

/*
=====================================
USER ROUTES
=====================================
*/

/*
JOIN QUEST
*/

router.post(
  "/join",
  rateLimiter,
  protect,
  joinQuestValidator,
  validate,
  invalidateCache({
    set: (req) => `my-quests:${req.user._id.toString()}`,
  }),
  joinQuest,
);

/*
SUBMIT QUEST
*/

router.post(
  "/submit/:id",
  protect,
  upload.single("proofFile"),
  submitQuestValidator,
  validate,
  invalidateCache({
    sets: (req) => [
      `my-quests:${req.user._id.toString()}`,
      `submissions:${req.params.id}`,
    ],
  }),
  submitQuest,
);

/*
MY JOINED QUESTS
*/

router.get(
  "/my-quests",
  protect,
  (req, res, next) => {
    res.locals.cacheSet = `my-quests:${req.user._id.toString()}`;
    next();
  },
  cacheMiddleware,
  getMyJoinedQuests,
);

/*
LEADERBOARD
*/

router.get(
  "/leaderboard",
  protect,
  (req, res, next) => {
    res.locals.cacheSet = "leaderboard";
    next();
  },
  cacheMiddleware,
  getLeaderboard,
);

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
  (req, res, next) => {
    res.locals.cacheSet = `submissions:${req.params.questId}`;
    next();
  },
  cacheMiddleware,
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
  invalidateCache({ set: "leaderboard" }),
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
  invalidateCache({ set: "leaderboard" }),
  rejectSubmission,
);

module.exports = router;
