const { ChatOpenAI } = require("@langchain/openai");

const getAiModel = () => {
  console.log("KEY:", process.env.OPEN_ROUTER_API_KEY);

  return new ChatOpenAI({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    model: "deepseek/deepseek-chat",
    configuration: {
      baseURL: "https://openrouter.ai/api/v1",
      defaultHeaders: {
        "HTTP-Referer": process.env.FRONTEND_URL,
        "X-Title": "VaibQuest",
      },
    },
  });
};

module.exports = { getAiModel };
