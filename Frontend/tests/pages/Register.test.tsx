import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Register from "../../src/pages/Register";
import * as authService from "../../src/services/auth.service";

vi.mock("../../src/services/auth.service");
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("Register Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders the registration form", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter password")).toBeInTheDocument();
  });

  it("validates fields properly on submit", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    expect(
      await screen.findByText("Username is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Email address is required."),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password is required."),
    ).toBeInTheDocument();
  });

  it("calls registerUser API with proper data", async () => {
    vi.mocked(authService.registerUser).mockResolvedValueOnce({
      success: true,
      token: "fake-token",
      user: { username: "newuser", email: "new@user.com" },
      message: "Registered",
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Enter username"), {
      target: { value: "newuser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "new@user.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Register/i }));

    await waitFor(() => {
      expect(authService.registerUser).toHaveBeenCalled();
    });
  });
});
