const {
  joinQuest,
  submitQuest,
  getMyJoinedQuests,
  getLeaderboard,
  getQuestSubmissions,
  approveSubmission,
  rejectSubmission,
} = require("../../src/controllers/userQuest.controller");
const UserQuest = require("../../src/models/userQuest.model");
const Quest = require("../../src/models/quest.model");
const User = require("../../src/models/user.model");

jest.mock("../../src/models/userQuest.model");
jest.mock("../../src/models/quest.model");
jest.mock("../../src/models/user.model");

describe("UserQuest Controller Full Coverage", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: { id: "uq123", questId: "q123" },
      query: { page: 1, limit: 10 },
      user: { id: "user123" },
      file: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("joinQuest", () => {
    it("should return 400 if quest already joined", async () => {
      UserQuest.findOne.mockResolvedValue({ _id: "uq1" });
      await joinQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should join quest successfully", async () => {
      UserQuest.findOne.mockResolvedValue(null);
      UserQuest.create.mockResolvedValue({ _id: "uq2" });
      await joinQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle joinQuest errors", async () => {
      UserQuest.findOne.mockRejectedValue(new Error("DB"));
      await joinQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("submitQuest", () => {
    const mockUserQuest = {
      userId: "user123",
      status: "started",
      save: jest.fn(),
    };
    const mockQuest = { deadline: new Date(Date.now() + 100000) };

    it("should return 404 if participation is not found", async () => {
      UserQuest.findById.mockResolvedValue(null);
      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 403 if unauthorized", async () => {
      UserQuest.findById.mockResolvedValue({
        ...mockUserQuest,
        userId: "other",
      });
      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 400 if already submitted", async () => {
      UserQuest.findById.mockResolvedValue({
        ...mockUserQuest,
        status: "submitted",
      });
      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if quest not found", async () => {
      UserQuest.findById.mockResolvedValue(mockUserQuest);
      Quest.findById.mockResolvedValue(null);
      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 if quest deadline expired", async () => {
      UserQuest.findById.mockResolvedValue(mockUserQuest);
      Quest.findById.mockResolvedValue({
        deadline: new Date(Date.now() - 100000),
      });
      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should submit quest successfully with file", async () => {
      UserQuest.findById.mockResolvedValue(mockUserQuest);
      Quest.findById.mockResolvedValue(mockQuest);
      req.file = { path: "uploads/file.png" };
      req.body = { proofLink: "link", submissionNote: "note" };

      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockUserQuest.save).toHaveBeenCalled();
    });

    it("should handle submitQuest errors", async () => {
      UserQuest.findById.mockRejectedValue(new Error("DB"));
      await submitQuest(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getMyJoinedQuests", () => {
    it("should get user joined quests successfully", async () => {
      UserQuest.countDocuments.mockResolvedValue(5);
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      UserQuest.find.mockReturnValue(mockChain);
      await getMyJoinedQuests(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle getMyJoinedQuests errors", async () => {
      UserQuest.countDocuments.mockRejectedValue(new Error("DB"));
      await getMyJoinedQuests(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getLeaderboard", () => {
    it("should get leaderboard successfully", async () => {
      User.countDocuments.mockResolvedValue(5);
      const mockChain = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      User.find.mockReturnValue(mockChain);
      await getLeaderboard(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle getLeaderboard errors", async () => {
      User.countDocuments.mockRejectedValue(new Error("DB"));
      await getLeaderboard(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getQuestSubmissions", () => {
    it("should get quest submissions successfully", async () => {
      UserQuest.countDocuments.mockResolvedValue(5);
      const mockChain = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([]),
      };
      UserQuest.find.mockReturnValue(mockChain);
      await getQuestSubmissions(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle getQuestSubmissions errors", async () => {
      UserQuest.countDocuments.mockRejectedValue(new Error("DB"));
      await getQuestSubmissions(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("approveSubmission", () => {
    const mockUserQuest = {
      questId: "q1",
      userId: "u1",
      status: "submitted",
      save: jest.fn(),
    };
    const mockQuest = { rewardXP: 100 };
    const mockUser = {
      totalXP: 100,
      badges: [],
      markModified: jest.fn(),
      save: jest.fn(),
    };

    it("should return 404 if submission not found", async () => {
      UserQuest.findById.mockResolvedValue(null);
      await approveSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should prevent re-approving", async () => {
      UserQuest.findById.mockResolvedValue({ status: "approved" });
      await approveSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 404 if quest or user not found", async () => {
      UserQuest.findById.mockResolvedValue(mockUserQuest);
      Quest.findById.mockResolvedValue(null);
      await approveSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should approve submission successfully", async () => {
      UserQuest.findById.mockResolvedValue(mockUserQuest);
      Quest.findById.mockResolvedValue(mockQuest);
      User.findById.mockResolvedValue(mockUser);

      await approveSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockUserQuest.save).toHaveBeenCalled();
    });

    it("should handle approveSubmission errors", async () => {
      UserQuest.findById.mockRejectedValue(new Error("DB"));
      await approveSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("rejectSubmission", () => {
    const mockUserQuest = {
      questId: "q1",
      userId: "u1",
      status: "submitted",
      save: jest.fn(),
    };

    it("should return 404 if submission not found", async () => {
      UserQuest.findById.mockResolvedValue(null);
      await rejectSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should prevent re-rejecting", async () => {
      UserQuest.findById.mockResolvedValue({ status: "rejected" });
      await rejectSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject successfully if previously approved (recalculates XP)", async () => {
      const approvedUserQuest = {
        ...mockUserQuest,
        status: "approved",
        save: jest.fn(),
      };
      const mockQuest = { rewardXP: 100 };
      const mockUser = {
        totalXP: 200,
        badges: [],
        markModified: jest.fn(),
        save: jest.fn(),
      };

      UserQuest.findById.mockResolvedValue(approvedUserQuest);
      Quest.findById.mockResolvedValue(mockQuest);
      User.findById.mockResolvedValue(mockUser);

      await rejectSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockUser.totalXP).toBe(100);
      expect(mockUser.save).toHaveBeenCalled();
      expect(approvedUserQuest.save).toHaveBeenCalled();
    });

    it("should return 404 if previously approved but quest/user not found", async () => {
      const approvedUserQuest = { ...mockUserQuest, status: "approved" };
      UserQuest.findById.mockResolvedValue(approvedUserQuest);
      Quest.findById.mockResolvedValue(null);
      await rejectSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should reject successfully without recalculating XP if not previously approved", async () => {
      UserQuest.findById.mockResolvedValue(mockUserQuest);
      await rejectSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockUserQuest.save).toHaveBeenCalled();
    });

    it("should handle rejectSubmission errors", async () => {
      UserQuest.findById.mockRejectedValue(new Error("DB"));
      await rejectSubmission(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
