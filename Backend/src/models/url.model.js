const { db } = require("../utils/db");

async function findByLongUrl(longUrl) {
    const { rows } = await db.query(
        `SELECT id, short_code
         FROM urls
         WHERE long_url=$1
         LIMIT 1`,
        [longUrl]
    );

    return rows[0];
}

async function insertUrl(longUrl, expiresAt) {
    const { rows } = await db.query(
        `INSERT INTO urls(long_url,expires_at)
         VALUES($1,$2)
         RETURNING id`,
        [longUrl, expiresAt]
    );

    return rows[0].id;
}

async function updateShortCode(id, shortCode) {
    await db.query(
        `UPDATE urls
         SET short_code=$1
         WHERE id=$2`,
        [shortCode, id]
    );
}

async function findByShortCode(shortCode) {
    const { rows } = await db.query(
        `SELECT *
         FROM urls
         WHERE short_code=$1`,
        [shortCode]
    );

    return rows[0];
}

async function incrementClicks(shortCode) {
    await db.query(
        `UPDATE urls
         SET click_count = click_count + 1
         WHERE short_code=$1`,
        [shortCode]
    );
}

module.exports = {
    insertUrl,
    updateShortCode,
    findByShortCode,
    incrementClicks,
    findByLongUrl,
};