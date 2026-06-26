const urlService = require("../services/url.service");

async function shorten(req, res) {
  try {
    const { longUrl, expiresAt } = req.body;

    if (!longUrl) {
      return res.status(400).json({
        message: "longUrl is required",
      });
    }

    const shortCode = await urlService.createShortUrl(longUrl, expiresAt);

    // Get correct protocol on Vercel
    const protocol = req.headers["x-forwarded-proto"] || "https";

    res.status(201).json({
      shortUrl: `${protocol}://${req.get("host")}/u/${shortCode}`,
    });
  } catch (err) {
    console.error("Controller shorten error:", err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

async function redirect(req, res) {
  try {
    const { shortCode } = req.params;

    const longUrl = await urlService.resolveShortUrl(shortCode);

    if (!longUrl) {
      return res.status(404).json({
        message: "URL not found or expired",
      });
    }

    return res.redirect(302, longUrl);
  } catch (err) {
    console.error("Controller redirect error:", err);

    res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  shorten,
  redirect,
};