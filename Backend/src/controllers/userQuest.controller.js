const User = require("../models/user.model");
const Quest = require("../models/quest.model");
const UserQuest = require("../models/userQuest.model");

/*
=====================================
BADGE RULES
=====================================
*/

const BADGE_RULES = [
  { xp: 500, badge: "bronze" },
  { xp: 1500, badge: "silver" },
  { xp: 3000, badge: "gold" },
  { xp: 5000, badge: "platinum" },
  { xp: 10000, badge: "diamond" },
];

/*
=====================================
HELPER FUNCTION
=====================================
*/

const calculateBadges = (xp) => {
  const badges = [];

  for (const rule of BADGE_RULES) {
    if (xp >= rule.xp) {
      badges.push(rule.badge);
    }
  }

  return badges;
};

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
      status: "started",
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

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Quest not found",
      });
    }

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const query = { userId: req.user.id };
    const totalQuests = await UserQuest.countDocuments(query);
    const totalPages = Math.ceil(totalQuests / limit);

    const quests = await UserQuest.find(query)
      .populate("questId")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      quests,
      pagination: {
        currentPage: page,
        totalPages,
        totalQuests,
      },
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const query = { role: "user" };
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(query)
      .select("username totalXP badges avatar")
      .sort({
        totalXP: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
      },
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const skip = (page - 1) * limit;

    const query = { questId: req.params.questId };
    const totalSubmissions = await UserQuest.countDocuments(query);
    const totalPages = Math.ceil(totalSubmissions / limit);

    const submissions = await UserQuest.find(query)
      .populate("userId", "username email avatar")
      .populate("questId", "title")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      submissions,
      pagination: {
        currentPage: page,
        totalPages,
        totalSubmissions,
      },
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
    Prevent Re-approving
    */

    if (userQuest.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Submission is already approved",
      });
    }

    /*
    Find Quest & User
    */

    const quest = await Quest.findById(userQuest.questId);

    const user = await User.findById(userQuest.userId);

    if (!quest || !user) {
      return res.status(404).json({
        success: false,
        message: "Associated Quest or User not found",
      });
    }

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
    Recalculate Badges
    */

    user.badges = calculateBadges(user.totalXP);

    user.markModified("badges");

    /*
    Save Changes
    */

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
    Prevent Re-rejecting
    */

    if (userQuest.status === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Submission is already rejected",
      });
    }

    /*
    If previously approved,
    remove XP and recalculate badges
    */

    if (userQuest.status === "approved") {
      const quest = await Quest.findById(userQuest.questId);

      const user = await User.findById(userQuest.userId);

      if (!quest || !user) {
        return res.status(404).json({
          success: false,
          message: "Associated Quest or User not found",
        });
      }

      /*
      Deduct XP
      */

      user.totalXP = Math.max(0, (user.totalXP || 0) - (quest.rewardXP || 0));

      /*
      Recalculate Badges
      */

      user.badges = calculateBadges(user.totalXP);

      user.markModified("badges");

      /*
      Save User
      */

      await user.save();
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
