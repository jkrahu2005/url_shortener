const urlModel = require('../models/url.model');
const { encodeBase62 } = require('../utils/base62');
const redisClient = require('../utils/redisClient');
async function createShortUrl(longUrl, expiresAt = null) {
  try {
    // ✅ STEP 1: Check if URL already exists
    const existing = await urlModel.findByLongUrl(longUrl);

    if (existing && existing.short_code) {
      return existing.short_code;
    }

    // ✅ STEP 2: Insert new URL
    const id = await urlModel.insertUrl(longUrl, expiresAt);

    // ✅ STEP 3: Generate short code
    const shortCode = encodeBase62(id);

    // ✅ STEP 4: Update row
    await urlModel.updateShortCode(id, shortCode);

    return shortCode;
  } catch (err) {
    console.error('Service createShortUrl error:', err.message);
    throw err;
  }
}


async function resolveShortUrl(shortCode) {
  try {
    const cacheKey = `short:url:${shortCode}`;

    // 1️⃣ TRY REDIS FIRST (READ CACHE)
    if (redisClient.isReady) {
      console.log('ready');
      const cachedUrl = await redisClient.get(cacheKey);
      if (cachedUrl) {
        console.log('cache hit');
        return cachedUrl; // 🔥 CACHE HIT
      }
    }

    // 2️⃣ CACHE MISS → QUERY DB
    console.log('cache missed')
    const record = await urlModel.findByShortCode(shortCode);
    if (!record) return null;

    // expiry check
    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      return null;
    }

    // 3️⃣ SAVE TO REDIS AFTER DB FETCH
    if (redisClient.isReady) {
      if (record.expires_at) {
        const ttlSeconds = Math.floor(
          (new Date(record.expires_at).getTime() - Date.now()) / 1000
        );
        if (ttlSeconds > 0) {
          await redisClient.setEx(cacheKey, ttlSeconds, record.long_url);
        }
      } else {
        await redisClient.set(cacheKey, record.long_url);
      }
    }

    // async analytics (non-blocking)
    urlModel.incrementClicks(shortCode);

    return record.long_url;
  } catch (err) {
    console.error('Service resolveShortUrl error:', err.message);
    throw err;
  }
}

module.exports = {
  createShortUrl,
  resolveShortUrl
};
