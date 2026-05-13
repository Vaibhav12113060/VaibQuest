import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Dashboard from "../../src/pages/Dashboard";
import * as questService from "../../src/services/quest.service";
import * as userQuestService from "../../src/services/userQuest.service";

vi.mock("../../src/services/quest.service");
vi.mock("../../src/services/userQuest.service");

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "TestHero", role: "user" }),
    );
  });

  it("fetches and renders quests successfully", async () => {
    // Mock the backend API responses
    vi.mocked(questService.getAllQuests).mockResolvedValueOnce({
      success: true,
      quests: [
        {
          _id: "q1",
          title: "Slay the Dragon",
          description: "A difficult quest",
          rewardXP: 1000,
          deadline: new Date(Date.now() + 86400000).toISOString(),
        },
      ],
      pagination: { currentPage: 1, totalPages: 1 },
    });

    vi.mocked(userQuestService.getMyJoinedQuests).mockResolvedValueOnce({
      success: true,
      quests: [], // User hasn't joined any quests yet
    });

    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>,
    );

    // Wait for the loader to disappear and quests to render
    await waitFor(() => {
      expect(screen.getByText("Slay the Dragon")).toBeInTheDocument();
    });
    expect(screen.getByText(/TestHero/i)).toBeInTheDocument(); // Welcome banner username
  });
});
