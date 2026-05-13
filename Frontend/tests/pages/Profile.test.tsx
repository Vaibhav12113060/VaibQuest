import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Profile from "../../src/pages/Profile";
import * as authService from "../../src/services/auth.service";

vi.mock("../../src/services/auth.service");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Profile Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "ProfileUser",
        email: "profile@user.com",
        role: "user",
        totalXP: 100,
      }),
    );

    // Global mock so component doesn't crash on second test render
    vi.mocked(authService.getMyProfile).mockResolvedValue({
      success: true,
      user: {
        username: "ProfileUser",
        email: "profile@user.com",
        role: "user",
        totalXP: 100,
      },
    });
  });

  it("renders user information from localStorage and syncs with API", async () => {
    vi.mocked(authService.getMyProfile).mockResolvedValueOnce({
      success: true,
      user: {
        username: "ProfileUser",
        email: "profile@user.com",
        role: "user",
        totalXP: 150,
      }, // Updated XP
    });

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    expect(screen.getByText("ProfileUser")).toBeInTheDocument();
    expect(screen.getByText("profile@user.com")).toBeInTheDocument();

    // Wait for API sync
    await waitFor(() => {
      expect(screen.getByText("XP: 150")).toBeInTheDocument();
    });
  });

  it("shows error if new passwords do not match", async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>,
    );

    // Wait for the initial profile fetch to settle to avoid act() warnings
    await waitFor(() => {
      expect(screen.getByText("ProfileUser")).toBeInTheDocument();
    });

    const currentPassInput = screen.getByPlaceholderText("Current Password");
    const newPassInput = screen.getByPlaceholderText("New Password");
    const confirmPassInput = screen.getByPlaceholderText(
      "Confirm New Password",
    );
    const updateBtn = screen.getByRole("button", { name: /Update Password/i });

    // Fill all required fields so the form can actually submit
    fireEvent.change(currentPassInput, { target: { value: "oldpassword123" } });
    fireEvent.change(newPassInput, { target: { value: "password123" } });
    fireEvent.change(confirmPassInput, { target: { value: "password456" } });

    fireEvent.click(updateBtn);

    // Vitest mock check for toast
    const toast = await import("react-hot-toast");
    await waitFor(() => {
      expect(toast.default.error).toHaveBeenCalledWith(
        "Passwords do not match!",
      );
    });
  });
});
