import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosInstance from "../../src/api/axios";
import * as authService from "../../src/services/auth.service";

// Mock the entire axios module
vi.mock("../../src/api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("Auth Service API Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registerUser calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);
    const userData = { email: "test@test.com" };

    const result = await authService.registerUser(userData);
    expect(axiosInstance.post).toHaveBeenCalledWith("/auth/register", userData);
    expect(result).toEqual(mockResponse.data);
  });

  it("loginUser calls correct endpoint", async () => {
    const mockResponse = { data: { token: "abc" } };
    vi.mocked(axiosInstance.post).mockResolvedValueOnce(mockResponse);

    const result = await authService.loginUser({ email: "test@test.com" });
    expect(axiosInstance.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@test.com",
    });
    expect(result).toEqual(mockResponse.data);
  });

  it("getCurrentUser calls correct endpoint", async () => {
    const mockResponse = { data: { user: {} } };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

    const result = await authService.getCurrentUser();
    expect(axiosInstance.get).toHaveBeenCalledWith("/auth/me");
    expect(result).toEqual(mockResponse.data);
  });

  it("getMyProfile calls correct endpoint", async () => {
    const mockResponse = { data: { user: {} } };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

    const result = await authService.getMyProfile();
    expect(axiosInstance.get).toHaveBeenCalledWith("/auth/profile");
    expect(result).toEqual(mockResponse.data);
  });

  it("changeProfilePicture calls correct endpoint with FormData", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.put).mockResolvedValueOnce(mockResponse);
    const formData = new FormData();
    formData.append("avatar", "test.png");

    const result = await authService.changeProfilePicture(formData);
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/auth/profile/change-avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("changePassword calls correct endpoint", async () => {
    const mockResponse = { data: { success: true } };
    vi.mocked(axiosInstance.put).mockResolvedValueOnce(mockResponse);
    const passwordData = { oldPassword: "old", newPassword: "new" };

    const result = await authService.changePassword(passwordData);
    expect(axiosInstance.put).toHaveBeenCalledWith(
      "/auth/profile/change-password",
      passwordData,
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("getAllUsers calls correct endpoint", async () => {
    const mockResponse = { data: { users: [] } };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

    const result = await authService.getAllUsers();
    expect(axiosInstance.get).toHaveBeenCalledWith("/auth/users");
    expect(result).toEqual(mockResponse.data);
  });

  it("getUserProfileByAdmin calls correct endpoint", async () => {
    const mockResponse = { data: { user: {} } };
    vi.mocked(axiosInstance.get).mockResolvedValueOnce(mockResponse);

    const result = await authService.getUserProfileByAdmin("user123");
    expect(axiosInstance.get).toHaveBeenCalledWith("/auth/user/user123");
    expect(result).toEqual(mockResponse.data);
  });
});
