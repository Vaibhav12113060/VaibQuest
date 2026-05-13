const {
  registerUser,
  loginUser,
  getMyProfile,
} = require("../../src/controllers/auth.controller");
const User = require("../../src/models/user.model");

jest.mock("../../src/models/user.model");

describe("Auth Controller Unit Tests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { id: "user123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should handle server errors during registerUser", async () => {
    // Force the database to throw an error to test the catch block
    User.findOne.mockRejectedValue(new Error("Database error"));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false }),
    );
  });

  it("should handle server errors during loginUser", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });
    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should handle profile fetch errors", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockRejectedValue(new Error("Database error")),
    });

    await getMyProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should return 404 if profile not found", async () => {
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });
    await getMyProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});
