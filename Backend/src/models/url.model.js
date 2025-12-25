const {db} = require('../utils/db');
async function findByLongUrl(longUrl) {
  try {
    const [rows] = await db.query(
      `SELECT id, short_code FROM urls WHERE long_url = ? LIMIT 1`,
      [longUrl]
    );
    return rows[0];
  } catch (err) {
    console.error('DB findByLongUrl error:', err.message);
    throw err;
  }
}

async function insertUrl(longUrl, expiresAt) {
  try {
    const [result] = await db.query(
      `INSERT INTO urls (long_url, expires_at) VALUES (?, ?)`,
      [longUrl, expiresAt]
    )
    console.log('Insert result:', result);
    return result.insertId;
  } catch (err) {
    console.error('DB insertUrl error:', err.message);
    throw err; // propagate upward
  }
}

async function updateShortCode(id, shortCode) {
  try {
    console.log('Updating short_code:', shortCode, 'for id:', id);

    const [result] = await db.query(
      `UPDATE urls SET short_code = ? WHERE id = ?`,
      [shortCode, id]
    );

    console.log('Update result:', result);
  } catch (err) {
    console.error('DB updateShortCode error:', err.message);
    throw err;
  }
}


async function findByShortCode(shortCode) {
  try {
    const [rows] = await db.query(
      `SELECT * FROM urls WHERE short_code = ?`,
      [shortCode]
    );
    return rows[0];
  } catch (err) {
    console.error('DB findByShortCode error:', err.message);
    throw err;
  }
}

async function incrementClicks(shortCode) {
  try {
    await db.query(
      `UPDATE urls SET click_count = click_count + 1 WHERE short_code = ?`,
      [shortCode]
    );
  } catch (err) {
    // non-critical → log only
    console.error('DB incrementClicks error:', err.message);
  }
}

module.exports = {
  insertUrl,
  updateShortCode,
  findByShortCode,
  incrementClicks,
  findByLongUrl
};
