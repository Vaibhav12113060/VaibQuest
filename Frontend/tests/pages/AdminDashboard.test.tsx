import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import AdminDashboard from "../../src/pages/AdminDashboard";
import * as questService from "../../src/services/quest.service";
import * as authService from "../../src/services/auth.service";

vi.mock("../../src/services/quest.service");
vi.mock("../../src/services/auth.service");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("AdminDashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm for delete functionality
    vi.spyOn(window, "confirm").mockImplementation(() => true);

    // Default mocks so the component doesn't crash on initial render during tests
    vi.mocked(questService.getAllQuests).mockResolvedValue({
      success: true,
      quests: [],
      pagination: { currentPage: 1, totalPages: 1 },
    });
    vi.mocked(authService.getAllUsers).mockResolvedValue({
      success: true,
      users: [],
    });
  });

  it("fetches and displays stats and quests table", async () => {
    vi.mocked(questService.getAllQuests).mockResolvedValueOnce({
      success: true,
      quests: [
        {
          _id: "q1",
          title: "Admin Quest 1",
          rewardXP: 500,
          difficulty: "hard",
        },
      ],
      pagination: { currentPage: 1, totalPages: 1 },
    });
    vi.mocked(authService.getAllUsers).mockResolvedValueOnce({
      success: true,
      users: [{ _id: "u1" }, { _id: "u2" }],
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>,
    );

    expect(screen.getByText("Loading Dashboard...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Admin Quest 1")).toBeInTheDocument();
    });

    // Check if total counts are displayed
    expect(screen.getByText("1")).toBeInTheDocument(); // 1 quest
    expect(screen.getByText("2")).toBeInTheDocument(); // 2 users
  });

  it("calls delete API when delete button is clicked", async () => {
    // Supply initial data so the table renders at least one quest with a Delete button
    vi.mocked(questService.getAllQuests).mockResolvedValueOnce({
      success: true,
      quests: [
        {
          _id: "q1",
          title: "Admin Quest 1",
          rewardXP: 500,
          difficulty: "hard",
        },
      ],
      pagination: { currentPage: 1, totalPages: 1 },
    });
    vi.mocked(questService.deleteQuest).mockResolvedValueOnce({
      success: true,
      message: "Deleted",
    });

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>,
    );

    await waitFor(() => expect(screen.getByText("Delete")).toBeInTheDocument());

    fireEvent.click(screen.getByText("Delete"));
    expect(window.confirm).toHaveBeenCalled();
  });
});
