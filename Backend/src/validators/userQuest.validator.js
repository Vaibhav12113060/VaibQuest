const { body, param } = require("express-validator");

const joinQuestValidator = [
  body("questId").isMongoId().withMessage("A valid questId is required"),
];

const submitQuestValidator = [
  param("id").isMongoId().withMessage("Invalid User-Quest ID in URL"),
  body("submissionNote").optional().trim(),
  body().custom((value, { req }) => {
    if (!req.body.proofLink && !req.file) {
      throw new Error(
        "At least one proof (proofLink or proofFile) is required",
      );
    }
    return true;
  }),
];

const questIdParamValidator = [
  param("questId").isMongoId().withMessage("Invalid Quest ID in URL parameter"),
];

const mongoIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid ID in URL parameter"),
];

const rejectSubmissionValidator = [
  param("id").isMongoId().withMessage("Invalid ID in URL parameter"),
  body("reviewMessage")
    .notEmpty()
    .withMessage("A review message is required for rejection"),
];

module.exports = {
  joinQuestValidator,
  submitQuestValidator,
  questIdParamValidator,
  mongoIdParamValidator,
  rejectSubmissionValidator,
};
