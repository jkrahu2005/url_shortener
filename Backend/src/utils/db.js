require("dotenv").config();

const { Pool } = require("pg");

let connectionString = process.env.DATABASE_URL;

// Replace sslmode=require with sslmode=verify-full to avoid the pg warning
if (connectionString && connectionString.includes("sslmode=require")) {
  connectionString = connectionString.replace(
    "sslmode=require",
    "sslmode=verify-full"
  );
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err.message);
});

async function connect() {
  try {
    const client = await pool.connect();

    const result = await client.query("SELECT NOW()");

    console.log("✅ PostgreSQL Connected");
    console.log("🕒 Server Time:", result.rows[0].now);

    client.release();
  } catch (err) {
    console.error("❌ PostgreSQL Connection Failed");
    console.error(err.message);
    throw err;
  }
}

module.exports = {
  db: pool,
  connect,
};