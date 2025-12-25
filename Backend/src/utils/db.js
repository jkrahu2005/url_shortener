const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Promise-based pool
const db = pool.promise();

// 🔹 Explicit connect function (for server bootstrap)
async function connect() {
  try {
    await db.query('SELECT 1');
    console.log('✅ MySQL connected successfully');
  } catch (err) {
    console.error('❌ MySQL connection failed');
    console.error(err.message);
    throw err; // let server.js decide to exit
  }
}

module.exports = {
  db,
  connect
};
