const {
  createQuest,
  updateQuest,
  deleteQuest,
  getAllQuests,
  getQuestById,
} = require("../../src/controllers/quest.controller");
const Quest = require("../../src/models/quest.model");

jest.mock("../../src/models/quest.model");

describe("Quest Controller Full Coverage", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { title: "New Quest", rewardXP: 100, difficulty: "easy" },
      params: { id: "quest123" },
      query: { page: 1, limit: 5 },
      user: { id: "admin123" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("createQuest", () => {
    it("should create a quest successfully", async () => {
      Quest.create.mockResolvedValue({ _id: "q1", title: "New Quest" });
      await createQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should return 500 on createQuest database error", async () => {
      Quest.create.mockRejectedValue(new Error("DB Error"));
      await createQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("updateQuest", () => {
    it("should update a quest successfully", async () => {
      Quest.findByIdAndUpdate.mockResolvedValue({ title: "Updated Quest" });
      await updateQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on updateQuest database error", async () => {
      Quest.findByIdAndUpdate.mockRejectedValue(new Error("DB Error"));
      await updateQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteQuest", () => {
    it("should delete a quest successfully", async () => {
      Quest.findByIdAndDelete.mockResolvedValue({ _id: "q1" });
      await deleteQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should return 500 on deleteQuest database error", async () => {
      Quest.findByIdAndDelete.mockRejectedValue(new Error("DB Error"));
      await deleteQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getAllQuests", () => {
    it("should return all quests successfully", async () => {
      Quest.countDocuments.mockResolvedValue(10);
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([{ title: "q1" }]),
      };
      Quest.find.mockReturnValue(mockChain);

      await getAllQuests(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should return 500 on getAllQuests database error", async () => {
      Quest.countDocuments.mockRejectedValue(new Error("DB Error"));
      await getAllQuests(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getQuestById", () => {
    it("should return a quest successfully", async () => {
      Quest.findById.mockResolvedValue({ _id: "q1", title: "q1" });
      await getQuestById(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle getQuestById when quest is not found", async () => {
      Quest.findById.mockResolvedValue(null);
      await getQuestById(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 500 on getQuestById database error", async () => {
      Quest.findById.mockRejectedValue(new Error("DB Error"));
      await getQuestById(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
