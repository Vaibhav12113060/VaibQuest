const { getChatResponse } = require("../services/ai.service");

const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res
        .status(400)
        .json({ success: false, message: "Message is required" });
    }
    const response = await getChatResponse(userId, message);

    return res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("AI chat error:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message || "Server error" });
  }
};

module.exports = { handleChat };
