const Quest = require("../models/quest.model");

/*
=====================================
ADMIN CONTROLLERS
=====================================
*/

/*
CREATE QUEST
*/

const createQuest = async (req, res) => {
  try {
    const {
      title,
      description,
      rewardXP,
      deadline,
      difficulty,
      submissionType,
    } = req.body;

    const quest = await Quest.create({
      title,
      description,
      rewardXP,
      deadline,
      difficulty,
      submissionType,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Quest created successfully",
      quest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
UPDATE QUEST
*/

const updateQuest = async (req, res) => {
  try {
    const updatedQuest = await Quest.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Quest updated successfully",
      updatedQuest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
DELETE QUEST
*/

const deleteQuest = async (req, res) => {
  try {
    await Quest.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Quest deleted successfully",
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
USER CONTROLLERS
=====================================
*/

/*
GET ALL QUESTS
*/

const getAllQuests = async (req, res) => {
  try {
    const quests = await Quest.find({
      isActive: true,
    })
      .populate("createdBy", "username email")
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
GET SINGLE QUEST
*/

const getQuestById = async (req, res) => {
  try {
    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({
        success: false,
        message: "Quest not found",
      });
    }

    return res.status(200).json({
      success: true,
      quest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createQuest,
  updateQuest,
  deleteQuest,
  getAllQuests,
  getQuestById,
};
