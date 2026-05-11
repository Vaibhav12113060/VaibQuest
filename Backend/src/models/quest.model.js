const mongoose = require("mongoose");

const QUEST_DIFFICULTY = ["easy", "medium", "hard"];

const SUBMISSION_TYPES = ["link", "file", "both"];

const QuestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    rewardXP: {
      type: Number,
      required: true,
      min: 0,
    },

    deadline: {
      type: Date,
      required: true,
    },

    difficulty: {
      type: String,
      enum: QUEST_DIFFICULTY,
      default: "easy",
    },

    submissionType: {
      type: String,
      enum: SUBMISSION_TYPES,
      default: "both",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Quest", QuestSchema);
