const { PromptTemplate } = require("@langchain/core/prompts");
const { getAiModel } = require("../config/ai");
const User = require("../models/user.model");
const Quest = require("../models/quest.model");
const UserQuest = require("../models/userQuest.model");

const getChatResponse = async (userId, userMessage) => {
  // 1. Fetch all necessary data from MongoDB
  // Exclude quests that have already passed their deadline
  const user = await User.findById(userId).select("-password");
  const allQuests = await Quest.find({
    isActive: true,
    deadline: { $gte: new Date() },
  }).lean();
  const userQuests = await UserQuest.find({ userId })
    .populate("questId")
    .lean();

  if (!user) {
    throw new Error("User not found");
  }

  const joinedQuests = userQuests.filter(
    (uq) =>
      uq.questId && // Ensure the quest exists and is not deleted
      (uq.status === "started" || uq.status === "submitted") &&
      new Date(uq.questId.deadline) >= new Date(), // Check if the deadline has not passed
  );
  const completedQuestIds = userQuests
    .filter((uq) => uq.status === "approved")
    .map((uq) => uq.questId._id.toString());

  const availableQuests = allQuests.filter(
    (quest) => !completedQuestIds.includes(quest._id.toString()),
  );

  // 2. Create a detailed context string for the AI
  const userContext = {
    profile: {
      username: user.username,
      totalXP: user.totalXP,
      badges: user.badges,
      joinedAt: user.createdAt.toDateString(),
    },
    progress: {
      joinedQuests: joinedQuests.map((uq) => ({
        _id: uq.questId._id, // Include quest ID for frontend navigation
        title: uq.questId.title,
        status: uq.status,
        deadline: uq.questId.deadline.toDateString(),
      })),
      completedQuestsCount: completedQuestIds.length,
      isNewUser:
        user.totalXP === 0 &&
        user.badges.length === 0 &&
        joinedQuests.length === 0,
    },
    platformData: {
      availableQuests: availableQuests.map((q) => ({
        _id: q._id, // Include quest ID for frontend navigation
        title: q.title,
        description: q.description,
        rewardXP: q.rewardXP,
        difficulty: q.difficulty,
      })),
      leaderboardInfo: "The leaderboard ranks users by their total XP.",
      submissionInfo:
        "Users can submit proof for a quest they have joined. Submissions are reviewed by admins.",
    },
  };

  // 3. Define the PromptTemplate
  const template = `
    You are Vaib, a specialized AI assistant for the VaibQuest platform. Your primary goal is to provide structured, helpful, and accurate information to users about their journey on VaibQuest.

    **Strict Rules:**
    - Your response MUST be a valid JSON object.
    - If the user's query is related to VaibQuest, the JSON response should have a "type" of "QuestRelated" and a "data" object containing a "message" (a conversational response) and an optional "recommendations" array.
    - If the user asks for quest recommendations, populate the "recommendations" array with quest objects from the context. Each object in the array must include "_id", "title", and "rewardXP". Present these recommendations clearly in the message, preferably as a list.
    - If there are no available quests to recommend, return an empty "recommendations" array and state in the message that no quests are available right now.
    - If the user asks something unrelated to VaibQuest (e.g., general knowledge, coding help), the JSON response must have a "type" of "Unrelated" and the "data" object should contain a single "message" field with this exact text: "I'm designed only to assist with VaibQuest platform and learning-related queries."
    - Never suggest quests that the user has already completed.
    - Never suggest quests that are not in the 'availableQuests' list.
    - Never access a database or external APIs. All the information you need is provided in the context below.

    **Recommendation Logic:**
    - If the user is new (isNewUser is true) or has low XP, recommend beginner-friendly or low-XP quests from the 'availableQuests' list.
    - If the user has active (joined) quests, encourage them to complete those first before recommending new ones.
    - If the user has some XP, try to recommend quests that are similar to what they might be interested in, based on the available quest titles and descriptions.
    - If no similar quests are found, inform the user and recommend some other popular or high-XP quests.
    - Always try to provide a variety of quests if possible.
    
    **User and Platform Context:**
    {user_context}

    **User's Question:**
    "{user_message}"

    **Your JSON Response:**
  `;

  const prompt = PromptTemplate.fromTemplate(template);

  const aiModel = getAiModel();

  // 4. Create the chain and invoke the model
  const chain = prompt.pipe(aiModel);

  const response = await chain.invoke({
    user_context: JSON.stringify(userContext, null, 2),
    user_message: userMessage,
  });

  // 5. Parse the JSON response from the AI
  try {
    // Clean the response content to ensure it's a valid JSON string
    const cleanedContent = response.content
      .replace(/```json\n|```/g, "")
      .trim();
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("AI response is not a valid JSON:", error);
    throw new Error("Failed to get a valid response from the AI assistant.");
  }
};

module.exports = {
  getChatResponse,
};
