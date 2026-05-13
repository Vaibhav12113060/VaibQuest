import { describe, it, expect, beforeEach } from "vitest";
import axiosInstance from "../../src/api/axios";

describe("Axios Instance Tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should have the correct base URL configured", () => {
    expect(axiosInstance.defaults.baseURL).toBeDefined();
  });

  it("should add Authorization header if token exists in localStorage", async () => {
    // Set a fake token
    localStorage.setItem("token", "fake-jwt-token");

    // Extract the request interceptor logic
    const interceptors = (axiosInstance.interceptors.request as any).handlers;
    expect(interceptors.length).toBeGreaterThan(0);

    const requestInterceptor = interceptors[0].fulfilled;
    const config = { headers: {} };

    // Run the interceptor
    const updatedConfig = await requestInterceptor(config);

    expect(updatedConfig.headers.Authorization).toBe("Bearer fake-jwt-token");
  });

  it("should not add Authorization header if no token exists", async () => {
    const interceptors = (axiosInstance.interceptors.request as any).handlers;
    const requestInterceptor = interceptors[0].fulfilled;
    const config = { headers: {} };

    const updatedConfig = await requestInterceptor(config);
    expect(updatedConfig.headers.Authorization).toBeUndefined();
  });
});
