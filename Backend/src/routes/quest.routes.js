const express = require("express");

const {
  createQuest,
  updateQuest,
  deleteQuest,
  getAllQuests,
  getQuestById,
} = require("../controllers/quest.controller");

const cacheMiddleware = require("../middlewares/cache.middleware").default;
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { invalidateCache } = require("../middlewares/invalidation.middleware");
const validate = require("../middlewares/validator.middleware");
const {
  createQuestValidator,
  updateQuestValidator,
  mongoIdParamValidator,
} = require("../validators/quest.validator");

const router = express.Router();

/*
=====================================
USER ROUTES
=====================================
*/

/*
GET ALL QUESTS
*/

router.get(
  "/",
  protect,
  (req, res, next) => {
    res.locals.cacheSet = "quests";
    next();
  },
  cacheMiddleware,
  getAllQuests,
);

/*
GET SINGLE QUEST
*/

router.get(
  "/:id",
  protect,
  mongoIdParamValidator,
  validate,
  (req, res, next) => {
    res.locals.cacheSet = "quests";
    next();
  },
  cacheMiddleware,
  getQuestById,
);

/*
=====================================
ADMIN ROUTES
=====================================
*/

/*
CREATE QUEST
*/

router.post(
  "/create",
  protect,
  adminOnly,
  createQuestValidator,
  validate,
  invalidateCache({ set: "quests" }),
  createQuest,
);

/*
UPDATE QUEST
*/

router.put(
  "/update/:id",
  protect,
  adminOnly,
  updateQuestValidator,
  validate,
  invalidateCache({ set: "quests" }),
  updateQuest,
);

/*
DELETE QUEST
*/

router.delete(
  "/delete/:id",
  protect,
  adminOnly,
  mongoIdParamValidator,
  validate,
  invalidateCache({ set: "quests" }),
  deleteQuest,
);

module.exports = router;
