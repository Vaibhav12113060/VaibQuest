const express = require("express");
const { handleChat } = require("../controllers/ai.controller");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", protect, handleChat);

module.exports = router;
