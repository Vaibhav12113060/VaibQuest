const express = require("express");
const { handleChat } = require("../controllers/ai.controller");
const { protect } = require("../middlewares/authMiddleware");
const { default: rateLimiter } = require("../middlewares/ratelimit");

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", rateLimiter, protect, handleChat);

module.exports = router;
