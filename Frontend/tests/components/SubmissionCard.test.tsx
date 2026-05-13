import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import SubmissionCard from "../../src/components/SubmissionCard";

describe("SubmissionCard Component", () => {
  const mockSubmission = {
    _id: "sub123",
    userId: { _id: "user1", username: "Submitter", avatar: "" },
    status: "submitted",
    submissionNote: "Here is my work",
    proofLink: "https://github.com/myrepo",
  };

  const mockOnApprove = vi.fn();
  const mockOnReject = vi.fn();

  it("should render submission details correctly", () => {
    render(
      <BrowserRouter>
        <SubmissionCard
          submission={mockSubmission}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      </BrowserRouter>,
    );

    expect(screen.getByText("Submitter")).toBeInTheDocument();
    expect(screen.getByText('"Here is my work"')).toBeInTheDocument();
    // Using Regex (/.../i) to ignore the link emoji 🔗
    expect(screen.getByText(/View Attached Link/i)).toHaveAttribute(
      "href",
      "https://github.com/myrepo",
    );
  });

  it("should call approve and reject handlers on button click", () => {
    render(
      <BrowserRouter>
        <SubmissionCard
          submission={mockSubmission}
          onApprove={mockOnApprove}
          onReject={mockOnReject}
        />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /Approve/i }));
    expect(mockOnApprove).toHaveBeenCalledWith("sub123");

    fireEvent.click(screen.getByRole("button", { name: /Reject/i }));
    expect(mockOnReject).toHaveBeenCalledWith("sub123");
  });
});
