import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "../../src/api/axios";
import * as questService from "../../src/services/quest.service";

vi.mock("../../src/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Quest Service API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAllQuests fetches with correct pagination queries", async () => {
    const mockResponse = { data: { quests: [] } };
    vi.mocked(axiosInstance.get).mockResolvedValue(mockResponse);

    // With limit
    await questService.getAllQuests(2, 10);
    expect(axiosInstance.get).toHaveBeenCalledWith("/quests?page=2&limit=10");

    // Without limit
    await questService.getAllQuests(3);
    expect(axiosInstance.get).toHaveBeenCalledWith("/quests?page=3");
  });

  it("getQuestById calls correct endpoint", async () => {
    const mockResponse = { data: { quest: {} } };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

    const result = await questService.getQuestById("q123");
    expect(axiosInstance.get).toHaveBeenCalledWith("/quests/q123");
    expect(result).toEqual(mockResponse.data);
  });

  it("createQuest calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);
    const questData = { title: "New Quest" };

    const result = await questService.createQuest(questData);
    expect(axiosInstance.post).toHaveBeenCalledWith(
      "/quests/create",
      questData,
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("updateQuest calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.put).mockResolvedValueOnce(mockResponse);
    const questData = { title: "Updated" };

    const result = await questService.updateQuest("q123", questData);
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/quests/update/q123",
      questData,
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("deleteQuest calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.delete).mockResolvedValueOnce(mockResponse);

    const result = await questService.deleteQuest("q123");
    expect(axiosInstance.delete).toHaveBeenCalledWith("/quests/delete/q123");
    expect(result).toEqual(mockResponse.data);
  });
});
