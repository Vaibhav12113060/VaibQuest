const mongoose = require("mongoose");

const QUEST_STATUS = ["started", "submitted", "approved", "rejected"];

const UserQuestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quest",
      required: true,
    },

    status: {
      type: String,
      enum: QUEST_STATUS,
      default: "started",
    },

    proofLink: {
      type: String,
      default: null,
    },

    proofFile: {
      type: String,
      default: null,
    },

    submissionNote: {
      type: String,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewMessage: {
      type: String,
      default: null,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

UserQuestSchema.index(
  {
    userId: 1,
    questId: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("UserQuest", UserQuestSchema);
