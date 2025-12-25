const urlService = require('../services/url.service');

async function shorten(req, res) {
  try {
    console.log('api hitted');
    const { longUrl, expiresAt } = req.body;
    // console.log(longUrl);
    console.log(expiresAt)
    // console.log('1');
    if (!longUrl) {
      return res.status(400).json({ message: "longUrl is required" });
    }
    // console.log('2');
    const shortCode = await urlService.createShortUrl(longUrl, expiresAt);
    // console.log('3');
    res.status(201).json({
    shortUrl: `${req.protocol}://${req.get('host')}/u/${shortCode}`
    });

  } catch (err) {
    console.error('Controller shorten error:', err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function redirect(req, res) {
  try {
    const { shortCode } = req.params;

    const longUrl = await urlService.resolveShortUrl(shortCode);

    if (!longUrl) {
      return res.status(404).json({ message: "URL not found or expired" });
    }

    res.redirect(302, longUrl);
  } catch (err) {
    console.error('Controller redirect error:', err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  shorten,
  redirect
};
