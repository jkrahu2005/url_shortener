require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connect: connectDB } = require("./utils/db");
const redisClient = require("./utils/redisClient");
const UrlRouter = require("./routes/url.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://url-shortener-wheat-two.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/", UrlRouter);
app.use("/url", UrlRouter);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    database: "PostgreSQL",
  });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect PostgreSQL (Required)
    await connectDB();

    // Connect Redis (Optional)
    try {
      await redisClient.connect();
      console.log("✅ Redis connected");
    } catch (err) {
      console.warn("⚠️ Redis connection failed:", err.message);
      console.warn("⚠️ Continuing without Redis cache");
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server");
    console.error(err);
    process.exit(1);
  }
}

startServer();