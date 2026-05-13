import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import QuestCard from "../../src/components/QuestCard";
import * as userQuestService from "../../src/services/userQuest.service";

vi.mock("../../src/services/userQuest.service");
// Mocking the toaster notifications
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("QuestCard Component", () => {
  // Dummy quest data for testing
  const mockQuest = {
    _id: "quest123",
    title: "Learn React Testing",
    description: "Write your first vitest component test.",
    rewardXP: 250,
    // Set deadline to tomorrow so it's not expired
    deadline: new Date(Date.now() + 86400000).toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render quest details correctly", () => {
    render(<QuestCard quest={mockQuest} isJoinedStatus={false} />);

    // Check if title and description are visible
    expect(screen.getByText("Learn React Testing")).toBeInTheDocument();
    expect(
      screen.getByText("Write your first vitest component test."),
    ).toBeInTheDocument();

    // Check if XP is formatted correctly
    expect(screen.getByText("250 XP")).toBeInTheDocument();

    // Check if join button is available and enabled
    const joinBtn = screen.getByRole("button", { name: /Join Quest/i });
    expect(joinBtn).toBeInTheDocument();
    expect(joinBtn).not.toBeDisabled();
  });

  it("should display as 'Joined' and be disabled if user has already joined", () => {
    render(<QuestCard quest={mockQuest} isJoinedStatus={true} />);

    const joinedBtn = screen.getByRole("button", { name: /✓ Joined/i });
    expect(joinedBtn).toBeInTheDocument();
    expect(joinedBtn).toBeDisabled();
  });

  it("should call joinQuest API when join button is clicked", async () => {
    vi.mocked(userQuestService.joinQuest).mockResolvedValueOnce({
      success: true,
      message: "Joined successfully",
    });

    render(<QuestCard quest={mockQuest} isJoinedStatus={false} />);

    const joinBtn = screen.getByRole("button", { name: /Join Quest/i });
    fireEvent.click(joinBtn);

    await waitFor(() => {
      expect(userQuestService.joinQuest).toHaveBeenCalledWith("quest123");
    });
  });
});
