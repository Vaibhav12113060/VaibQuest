import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import LeaderboardCard from "../../src/components/LeaderboardCard";

describe("LeaderboardCard Component", () => {
  const mockUser = {
    _id: "user123",
    username: "TestHero",
    totalXP: 5000,
    avatar: "http://example.com/avatar.jpg",
    badges: ["gold", "platinum"],
  };

  it("should render user details, rank and XP correctly", () => {
    render(<LeaderboardCard user={mockUser} index={0} />);

    // Check rank
    expect(screen.getByText("#1")).toBeInTheDocument();

    // Check username
    expect(screen.getByText("TestHero")).toBeInTheDocument();

    // Check XP
    expect(screen.getByText("XP: 5000")).toBeInTheDocument();

    // Check if badges are rendered by looking at their alt text
    expect(screen.getByAltText("Gold")).toBeInTheDocument();
  });
});
