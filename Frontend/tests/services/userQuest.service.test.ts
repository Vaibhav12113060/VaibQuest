import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "../../src/api/axios";
import * as userQuestService from "../../src/services/userQuest.service";

vi.mock("../../src/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

describe("UserQuest Service API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("joinQuest calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);

    const result = await userQuestService.joinQuest("q123");
    expect(axiosInstance.post).toHaveBeenCalledWith("/user-quests/join", {
      questId: "q123",
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("submitQuest calls correct endpoint with FormData", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);
    const formData = new FormData();
    formData.append("proofLink", "http://test.com");

    const result = await userQuestService.submitQuest("uq123", formData);
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/user-quests/submit/uq123",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("getMyJoinedQuests handles pagination queries", async () => {
    const mockResponse = { data: { quests: [] } };
    vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

    await userQuestService.getMyJoinedQuests(2, 5);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/user-quests/my-quests?page=2&limit=5",
    );

    await userQuestService.getMyJoinedQuests(1);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/user-quests/my-quests?page=1",
    );
  });

  it("getLeaderboard handles pagination queries", async () => {
    const mockResponse = { data: { users: [] } };
    vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

    await userQuestService.getLeaderboard(1, 10);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/user-quests/leaderboard?page=1&limit=10",
    );

    await userQuestService.getLeaderboard(2);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/user-quests/leaderboard?page=2",
    );
  });

  it("getQuestSubmissions handles pagination queries", async () => {
    const mockResponse = { data: { submissions: [] } };
    vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

    await userQuestService.getQuestSubmissions("q123", 2, 4);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/user-quests/submissions/q123?page=2&limit=4",
    );

    await userQuestService.getQuestSubmissions("q123", 1);
    expect(axiosInstance.get).toHaveBeenCalledWith(
      "/user-quests/submissions/q123?page=1",
    );
  });

  it("approveSubmission calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.put).mockResolvedValueOnce(mockResponse);

    const result = await userQuestService.approveSubmission("sub123");
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/user-quests/approve/sub123",
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("rejectSubmission calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.put).mockResolvedValueOnce(mockResponse);

    const result = await userQuestService.rejectSubmission(
      "sub123",
      "Needs work",
    );
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/user-quests/reject/sub123",
      { reviewMessage: "Needs work" },
    );
    expect(result).toEqual(mockResponse.data);
  });
});
