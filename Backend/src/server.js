require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

const { connect: connectDB } = require('./utils/db');
const redisClient = require('./utils/redisClient');
const UrlRouter = require('./routes/url.routes');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use('/',UrlRouter)
app.use('/url', UrlRouter);


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // 1️⃣ Connect MySQL (MANDATORY)
    await connectDB();

    // 2️⃣ Connect Redis (OPTIONAL)
    try {
      await redisClient.connect();
      console.log('✅ Redis connected');
    } catch (err) {
      console.error('⚠️ Redis connection failed:', err.message);
      console.log('⚠️ Continuing without Redis cache');
    }

    // 3️⃣ Start server ONLY after DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server startup aborted due to DB failure');
    process.exit(1);
  }
}

startServer();
