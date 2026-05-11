const User = require("../models/user.model");
const Quest = require("../models/quest.model");
const UserQuest = require("../models/userQuest.model");

/*
=====================================
USER CONTROLLERS
=====================================
*/

/*
JOIN QUEST
*/

const joinQuest = async (req, res) => {
  try {
    const { questId } = req.body;

    const existingQuest = await UserQuest.findOne({
      userId: req.user.id,
      questId,
    });

    if (existingQuest) {
      return res.status(400).json({
        success: false,
        message: "Quest already joined",
      });
    }

    const joinedQuest = await UserQuest.create({
      userId: req.user.id,
      questId,
    });

    return res.status(201).json({
      success: true,
      message: "Quest joined successfully",
      joinedQuest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
SUBMIT QUEST
*/

const submitQuest = async (req, res) => {
  try {
    const { proofLink, submissionNote } = req.body;

    /*
    Upload File to Cloudinary
    */

    let proofFile = null;

    if (req.file) {
      proofFile = req.file.path;
    }

    /*
    Find User Quest
    */

    const userQuest = await UserQuest.findById(req.params.id);

    if (!userQuest) {
      return res.status(404).json({
        success: false,
        message: "Quest participation not found",
      });
    }

    /*
    Prevent Unauthorized Access
    */

    if (userQuest.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    /*
    Prevent Duplicate Submission
    */

    if (userQuest.status === "submitted") {
      return res.status(400).json({
        success: false,
        message: "Quest already submitted",
      });
    }

    /*
    Check Deadline
    */

    const quest = await Quest.findById(userQuest.questId);

    if (new Date() > quest.deadline) {
      return res.status(400).json({
        success: false,
        message: "Quest deadline expired",
      });
    }

    /*
    Save Submission
    */

    userQuest.proofLink = proofLink || null;

    userQuest.proofFile = proofFile || null;

    userQuest.submissionNote = submissionNote || null;

    userQuest.status = "submitted";

    userQuest.submittedAt = new Date();

    await userQuest.save();

    return res.status(200).json({
      success: true,
      message: "Quest submitted successfully",
      userQuest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
MY JOINED QUESTS
*/

const getMyJoinedQuests = async (req, res) => {
  try {
    const quests = await UserQuest.find({
      userId: req.user.id,
    })
      .populate("questId")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      quests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
LEADERBOARD
*/

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({
      role: "user",
    })
      .select("username totalXP badges avatar")
      .sort({
        totalXP: -1,
      })
      .limit(10);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
=====================================
ADMIN CONTROLLERS
=====================================
*/

/*
GET QUEST SUBMISSIONS
*/

const getQuestSubmissions = async (req, res) => {
  try {
    const submissions = await UserQuest.find({
      questId: req.params.questId,
    })
      .populate("userId", "username email avatar")
      .populate("questId", "title")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
APPROVE SUBMISSION
*/

const approveSubmission = async (req, res) => {
  try {
    const userQuest = await UserQuest.findById(req.params.id);

    if (!userQuest) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    /*
      Prevent Multiple Approvals
      */

    if (userQuest.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Submission already approved",
      });
    }

    /*
      Find Quest & User
      */

    const quest = await Quest.findById(userQuest.questId);

    const user = await User.findById(userQuest.userId);

    /*
      Update Submission
      */

    userQuest.status = "approved";

    userQuest.reviewedBy = req.user.id;

    userQuest.reviewedAt = new Date();

    /*
      Add XP
      */

    user.totalXP += quest.rewardXP;

    /*
      Badge Rules
      */

    const BADGE_RULES = [
      {
        xp: 100,
        badge: "bronze",
      },
      {
        xp: 500,
        badge: "silver",
      },
      {
        xp: 1000,
        badge: "gold",
      },
      {
        xp: 2000,
        badge: "platinum",
      },
      {
        xp: 5000,
        badge: "diamond",
      },
    ];

    /*
      Assign Badges
      */

    for (const rule of BADGE_RULES) {
      if (user.totalXP >= rule.xp && !user.badges.includes(rule.badge)) {
        user.badges.push(rule.badge);
      }
    }

    await user.save();

    await userQuest.save();

    return res.status(200).json({
      success: true,
      message: "Submission approved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
REJECT SUBMISSION
*/

const rejectSubmission = async (req, res) => {
  try {
    const { reviewMessage } = req.body;

    const userQuest = await UserQuest.findById(req.params.id);

    if (!userQuest) {
      return res.status(404).json({
        success: false,
        message: "Submission not found",
      });
    }

    /*
      Prevent Multiple Rejections
      */

    if (userQuest.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Submission already rejected",
      });
    }

    /*
      Update Submission
      */

    userQuest.status = "rejected";

    userQuest.reviewMessage = reviewMessage || null;

    userQuest.reviewedBy = req.user.id;

    userQuest.reviewedAt = new Date();

    await userQuest.save();

    return res.status(200).json({
      success: true,
      message: "Submission rejected successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  joinQuest,
  submitQuest,
  getMyJoinedQuests,
  getLeaderboard,
  getQuestSubmissions,
  approveSubmission,
  rejectSubmission,
};
