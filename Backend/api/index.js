require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connect: connectDB } = require("../src/utils/db");
const redisClient = require("../src/utils/redisClient");
const UrlRouter = require("../src/routes/url.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://url-shortener-nine-blush.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

let initialized = false;

async function initialize() {
  if (initialized) return;

  await connectDB();

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("✅ Redis connected");
    }
  } catch (err) {
    console.warn("⚠️ Redis unavailable:", err.message);
  }

  initialized = true;
}

app.use(async (req, res, next) => {
  await initialize();
  next();
});

app.use("/", UrlRouter);
app.use("/url", UrlRouter);

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    database: "PostgreSQL",
  });
});

module.exports = app;