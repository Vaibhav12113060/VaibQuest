import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import MyQuests from "../../src/pages/MyQuests";
import * as userQuestService from "../../src/services/userQuest.service";

vi.mock("../../src/services/userQuest.service");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("MyQuests Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state if no quests joined", async () => {
    vi.mocked(userQuestService.getMyJoinedQuests).mockResolvedValueOnce({
      success: true,
      quests: [],
    });

    render(
      <BrowserRouter>
        <MyQuests />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(
        screen.getByText("You haven't joined any quests yet."),
      ).toBeInTheDocument();
    });
  });

  it("renders joined quests successfully", async () => {
    vi.mocked(userQuestService.getMyJoinedQuests).mockResolvedValueOnce({
      success: true,
      quests: [
        {
          _id: "uq1",
          questId: {
            title: "Joined Quest 1",
            rewardXP: 100,
            // Make sure the date is in the future so it doesn't render "Expired"
            deadline: new Date(Date.now() + 86400000).toISOString(),
          },
          status: "started",
        },
      ],
      pagination: { currentPage: 1, totalPages: 1 },
    });

    render(
      <BrowserRouter>
        <MyQuests />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText("Joined Quest 1")).toBeInTheDocument();
    });
    expect(screen.getByText("Submit Proof")).toBeInTheDocument();
  });
});
