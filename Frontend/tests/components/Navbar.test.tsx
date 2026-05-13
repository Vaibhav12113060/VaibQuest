import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Navbar from "../../src/components/Navbar";

describe("Navbar Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("should render base links for a regular user", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "NormalUser", role: "user" }),
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Dashboard")[0]).toBeInTheDocument();
    expect(screen.getAllByText("My Quests")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Leaderboard")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Profile")[0]).toBeInTheDocument();

    // Admin link should NOT be present for normal users
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  it("should render Admin link for admin users", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "AdminUser", role: "admin" }),
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    expect(screen.getAllByText("Admin")[0]).toBeInTheDocument();
  });

  it("should clear localStorage on logout", () => {
    localStorage.setItem("token", "dummy_token");
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "TestUser", role: "user" }),
    );

    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );

    const logoutBtn = screen.getByRole("button", { name: /Logout/i });
    fireEvent.click(logoutBtn);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });
});
