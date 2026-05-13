import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import CreateQuest from "../../src/pages/CreateQuest";
import * as questService from "../../src/services/quest.service";

vi.mock("../../src/services/quest.service");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("CreateQuest Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create quest form", () => {
    render(
      <BrowserRouter>
        <CreateQuest />
      </BrowserRouter>,
    );
    expect(
      screen.getByPlaceholderText(/e.g., Learn React Basics/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(
      <BrowserRouter>
        <CreateQuest />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    expect(
      await screen.findByText("Quest title is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Description is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Reward XP is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Deadline is required."),
    ).toBeInTheDocument();
  });

  it("submits the form successfully with valid data", async () => {
    vi.mocked(questService.createQuest).mockResolvedValueOnce({
      success: true,
      message: "Quest created successfully",
    });

    const { container } = render(
      <BrowserRouter>
        <CreateQuest />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText(/e.g., Learn React Basics/i), {
      target: { name: "title", value: "New Quest" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Detail what needs to be done/i),
      { target: { name: "description", value: "Quest Desc" } },
    );
    fireEvent.change(screen.getByPlaceholderText(/e.g., 100/i), {
      target: { name: "rewardXP", value: "200" },
    });

    // Using querySelector to target date input since it doesn't have a placeholder or explicit id
    const deadlineInput = container.querySelector('input[name="deadline"]');
    if (deadlineInput) {
      fireEvent.change(deadlineInput, {
        target: { name: "deadline", value: "2026-12-31" },
      });
    }

    fireEvent.click(screen.getByRole("button", { name: /Create/i }));

    await waitFor(() => {
      expect(questService.createQuest).toHaveBeenCalledWith(
        expect.objectContaining({ title: "New Quest", rewardXP: "200" }),
      );
    });
  });
});
