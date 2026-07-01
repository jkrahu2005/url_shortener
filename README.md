# 🔗 URL Shortener Backend

A production-ready **URL Shortener Backend** built using **Node.js**, **Express.js**, **PostgreSQL (Neon)**, and **Redis**.

It generates compact short URLs using **Base62 Encoding**, stores data in **PostgreSQL**, and accelerates URL redirection using the **Cache-Aside Pattern** with Redis.

---

# ✨ Features

- 🔗 URL Shortening using Base62 Encoding
- ⚡ Fast URL Redirection with Redis Cache
- 🐘 Persistent Storage using PostgreSQL (Neon)
- 📊 Click Count Tracking
- ♻️ Duplicate URL Detection
- 🏗️ Clean MVC Architecture
- 🌐 CORS Support for Frontend Integration
- 🚀 REST API
- ☁️ Deployed on Vercel

---

# 🧠 How It Works

## 1️⃣ URL Shortening Flow

1. User submits a long URL.
2. Backend checks whether the URL already exists.
3. If it exists, the existing short URL is returned.
4. Otherwise:
   - A new row is inserted into PostgreSQL.
   - PostgreSQL generates a unique `BIGSERIAL` id.
   - The id is converted into a Base62 short code.
   - The short code is stored back in the database.
5. The backend returns the complete short URL.

---

## 2️⃣ Redirect Flow

1. User opens the short URL.
2. Backend first checks Redis.
3. If found:
   - Redirect immediately (Cache Hit ✅)
4. Otherwise:
   - Query PostgreSQL.
   - Store the result in Redis.
   - Increment click count asynchronously.
   - Redirect to the original URL.

---

# 🏗️ Tech Stack

- Node.js
- Express.js
- PostgreSQL (Neon)
- Redis
- dotenv
- CORS

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000

DATABASE_URL=your_neon_postgresql_connection_string

REDIS_URL=your_redis_connection_string

BASE_URL=http://localhost:3000
```

---

# 📂 Project Structure

```
URL_SHORTENER/
│
├── api/
│   └── index.js
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── vercel.json
├── package.json
└── .env
```

---

# 📡 API Endpoints

## Shorten URL

```
POST /url/shorten
```

### Request

```json
{
    "longUrl":"https://www.google.com"
}
```

### Response

```json
{
    "shortUrl":"https://your-domain.vercel.app/u/bM"
}
```

---

## Redirect URL

```
GET /u/:shortCode
```

Example

```
GET /u/bM
```

Redirects to the original URL.

---

# ⚡ Caching Strategy

```
User Request
      │
      ▼
Redis Cache
│           │
Hit ✅     Miss ❌
│           │
▼           ▼
Redirect   PostgreSQL
               │
               ▼
        Store in Redis
               │
               ▼
           Redirect
```

This Cache-Aside strategy significantly reduces database load and improves redirect performance.

---

# 🚀 Future Improvements

- 📈 Analytics Dashboard
- 👤 User Authentication
- ✏️ Custom Short URLs
- 🕒 URL Expiration
- 📊 Detailed Click Analytics
- 📱 QR Code Generation
- 🚦 Rate Limiting
- 🐳 Docker Deployment

---

# 📜 License

This project is licensed under the MIT License.

---

## ⭐ If you found this project useful, consider giving it a star!
