// server.js

const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

/*
=====================================
ROUTES IMPORTS
=====================================
*/

const authRoutes = require("./routes/auth.routes");
const questRoutes = require("./routes/quest.routes");
const userQuestRoutes = require("./routes/userQuest.routes");

/*
=====================================
DATABASE CONNECTION
=====================================
*/

connectDB();

const app = express();

/*
=====================================
MIDDLEWARES
=====================================
*/

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

    methods: ["GET", "POST", "PUT", "DELETE"],

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

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`.bgCyan.white);
});
