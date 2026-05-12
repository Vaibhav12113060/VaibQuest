const { body, param } = require("express-validator");

const QUEST_DIFFICULTY = ["easy", "medium", "hard"];
const SUBMISSION_TYPES = ["link", "file", "both"];

const createQuestValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("rewardXP")
    .isInt({ min: 0 })
    .withMessage("Reward XP must be a non-negative integer")
    .toInt(),
  body("deadline").isISO8601().toDate().withMessage("Invalid deadline format"),
  body("difficulty")
    .isIn(QUEST_DIFFICULTY)
    .withMessage("Invalid difficulty level"),
  body("submissionType")
    .isIn(SUBMISSION_TYPES)
    .withMessage("Invalid submission type"),
];

const updateQuestValidator = [
  param("id").isMongoId().withMessage("Invalid Quest ID in URL"),
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("rewardXP")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Reward XP must be a non-negative integer")
    .toInt(),
  body("deadline")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Invalid deadline format"),
  body("difficulty")
    .optional()
    .isIn(QUEST_DIFFICULTY)
    .withMessage("Invalid difficulty level"),
  body("submissionType")
    .optional()
    .isIn(SUBMISSION_TYPES)
    .withMessage("Invalid submission type"),
  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
];

const mongoIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID in URL parameter"),
];

module.exports = {
  createQuestValidator,
  updateQuestValidator,
  mongoIdParamValidator,
};
