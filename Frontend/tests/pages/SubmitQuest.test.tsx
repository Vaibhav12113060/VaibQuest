import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import SubmitQuest from "../../src/pages/SubmitQuest";
import * as userQuestService from "../../src/services/userQuest.service";

vi.mock("../../src/services/userQuest.service");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("SubmitQuest Component", () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the submission form correctly", () => {
    render(
      <SubmitQuest
        userQuestId="uq1"
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    expect(screen.getByText("Submit Quest Proof")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Proof Link/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument();
  });

  it("shows error when submitting without proof link or file", async () => {
    render(
      <SubmitQuest
        userQuestId="uq1"
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    const toast = await import("react-hot-toast");
    expect(toast.default.error).toHaveBeenCalledWith(
      "Please provide a proof link or upload a file.",
    );
    expect(userQuestService.submitQuest).not.toHaveBeenCalled();
  });

  it("calls submitQuest API on valid submission and triggers onSuccess", async () => {
    vi.mocked(userQuestService.submitQuest).mockResolvedValueOnce({
      success: true,
      message: "Submitted",
    });

    render(
      <SubmitQuest
        userQuestId="uq1"
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />,
    );

    // Fill the link input
    fireEvent.change(screen.getByPlaceholderText(/Proof Link/i), {
      target: { value: "https://github.com/myrepo" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    await waitFor(() => {
      expect(userQuestService.submitQuest).toHaveBeenCalled();
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});
