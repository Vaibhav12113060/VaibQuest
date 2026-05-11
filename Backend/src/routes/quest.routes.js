const express = require("express");

const {
  createQuest,
  updateQuest,
  deleteQuest,
  getAllQuests,
  getQuestById,
} = require("../controllers/quest.controller");

const { protect, adminOnly } = require("../middlewares/authMiddleware");
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

router.get("/", protect, getAllQuests);

/*
GET SINGLE QUEST
*/

router.get("/:id", protect, mongoIdParamValidator, validate, getQuestById);

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
  deleteQuest,
);

module.exports = router;
