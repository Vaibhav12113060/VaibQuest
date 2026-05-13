const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
// const app = require("../../src/app");
const app = require("../../src/server");
const User = require("../../src/models/user.model");

jest.setTimeout(60000); // Increase timeout to 60 seconds

let mongoServer;
let adminToken;
let testQuestId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);

  // Register a dummy admin user to get a token for protected routes
  const res = await request(app).post("/api/auth/register").send({
    username: "adminquest",
    email: "adminquest@test.com",
    password: "password123",
  });
  adminToken = res.body.token;

  // Promote this user to admin directly in the database
  await User.findOneAndUpdate(
    { email: "adminquest@test.com" },
    { role: "admin" },
  );
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("Quest Routes API Tests", () => {
  describe("POST /api/quests/create", () => {
    it("should create a new quest successfully", async () => {
      const response = await request(app)
        .post("/api/quests/create")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Test Quest",
          description: "This is a test quest description",
          rewardXP: 100,
          deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          difficulty: "easy",
          submissionType: "link",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.quest).toHaveProperty("_id");
      testQuestId = response.body.quest._id; // Save for later tests
    });
  });

  describe("GET /api/quests", () => {
    it("should get all active quests with pagination", async () => {
      const response = await request(app)
        .get("/api/quests?page=1&limit=5")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.quests)).toBe(true);
      expect(response.body).toHaveProperty("pagination");
    });
  });

  describe("DELETE /api/quests/delete/:id", () => {
    it("should delete the quest", async () => {
      const response = await request(app)
        .delete(`/api/quests/delete/${testQuestId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Quest deleted successfully");
    });
  });
});
