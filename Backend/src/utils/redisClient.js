const { createClient } = require("redis");

const redisClient = createClient({
  username: "default",
  password: process.env.REDIS_PASS,
  socket: {
    host: "redis-19898.crce292.ap-south-1-2.ec2.cloud.redislabs.com",
    port: 19898,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err.message);
});

module.exports = redisClient;