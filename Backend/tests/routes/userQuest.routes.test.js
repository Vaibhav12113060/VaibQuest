const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
// const app = require("../../src/app");
const app = require("../../src/server");
const User = require("../../src/models/user.model");

jest.setTimeout(60000); // Increase timeout to 60 seconds

let mongoServer;
let userToken;
let adminToken;
let testQuestId;
let userQuestId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);

  // Register standard user
  const userRes = await request(app).post("/api/auth/register").send({
    username: "hunter1",
    email: "hunter1@test.com",
    password: "password123",
  });
  userToken = userRes.body.token;

  // Register admin user
  const adminRes = await request(app).post("/api/auth/register").send({
    username: "adminmaster",
    email: "adminmaster@test.com",
    password: "password123",
  });
  adminToken = adminRes.body.token;

  // Promote admin user directly in the database
  await User.findOneAndUpdate(
    { email: "adminmaster@test.com" },
    { role: "admin" },
  );

  // Create a dummy quest to join
  const questRes = await request(app)
    .post("/api/quests/create")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      title: "Hero Quest",
      description: "Save the princess",
      rewardXP: 500,
      deadline: new Date(Date.now() + 86400000).toISOString(),
      difficulty: "medium",
      submissionType: "link",
    });
  testQuestId = questRes.body.quest._id;
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("UserQuest Routes API Tests", () => {
  describe("POST /api/user-quests/join", () => {
    it("should allow a user to join a quest", async () => {
      const response = await request(app)
        .post("/api/user-quests/join")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ questId: testQuestId });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.joinedQuest).toHaveProperty("_id");
      userQuestId = response.body.joinedQuest._id;
    });
  });

  describe("GET /api/user-quests/my-quests", () => {
    it("should return joined quests for the user", async () => {
      const response = await request(app)
        .get("/api/user-quests/my-quests")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.quests.length).toBeGreaterThan(0);
    });
  });

  describe("GET /api/user-quests/leaderboard", () => {
    it("should fetch the leaderboard", async () => {
      const response = await request(app)
        .get("/api/user-quests/leaderboard")
        .set("Authorization", `Bearer ${userToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.users)).toBe(true);
    });
  });
});
