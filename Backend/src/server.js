// server.js

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../docs/swagger.json");

const connectDB = require("./config/db");

/*
=====================================
ROUTES IMPORTS
=====================================
*/

const authRoutes = require("./routes/auth.routes");
const questRoutes = require("./routes/quest.routes");
const userQuestRoutes = require("./routes/userQuest.routes");

// Routes for AI
const aiRoutes = require("./routes/ai.routes");

/*
=====================================
DATABASE CONNECTION
=====================================
*/

if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express();

/*
=====================================
MIDDLEWARES
=====================================
*/

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// JSON Parser

app.use(express.json());

// Morgan Logger

app.use(morgan("dev"));

// Static Uploads Folder

app.use("/uploads", express.static("uploads"));

/*
=====================================
API ROUTES
=====================================
*/

app.use("/api/auth", authRoutes);

app.use("/api/quests", questRoutes);

app.use("/api/user-quests", userQuestRoutes);

/*
=====================================
AI ROUTE
=====================================
*/

app.use("/api/ai", aiRoutes);

/*
=====================================
SWAGGER API DOCS
=====================================
*/
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/*
=====================================
ROOT ROUTE
=====================================
*/

app.get("/", (req, res) => {
  res.send("VaibQuest API Running...");
});

/*
=====================================
SERVER
=====================================
*/

const PORT = process.env.PORT || 8000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on PORT: ${PORT}`.bgCyan.white);
  });
}

module.exports = app;
