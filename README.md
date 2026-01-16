# 🔗 URL Shortener Backend (Express + MySQL + Redis)

A production-ready **URL Shortener Backend** built using **Node.js + Express.js**, with **MySQL** for storage and **Redis** for caching.  
It generates short links using **Base62 Encoding** and provides fast redirection by leveraging Redis.

---

## ✨ Highlights

✅ URL Shortening using **Base62 Encoding**  
✅ Fast Redirects using **Redis Cache**  
✅ Reliable Storage using **MySQL**  
✅ Clean Express Architecture (routes/controllers/utils)  
✅ Scalable design for future features (analytics, expiry, custom alias, etc.)  
✅ Supports multiple frontend origins via CORS

---

## 🧠 How This URL Shortener Works

### 1️⃣ URL Shortening Flow
1. User sends a long URL
2. Backend stores it in MySQL
3. MySQL generates an `id` (AUTO_INCREMENT)
4. That `id` is converted to **Base62 shortCode**
5. Backend returns short URL

### 2️⃣ Redirect Flow (High Performance)
1. User visits `/<shortCode>`
2. Backend checks Redis cache
3. If exists → redirect immediately ✅
4. If not → query MySQL → store in Redis → redirect ✅

---

## 🏗️ Tech Stack

- **Node.js**
- **Express.js**
- **MySQL**
- **Redis**
- **dotenv**
- **cors**

---

## ⚙️ Environment Variables

Create a `.env` file in project root:

```env
PORT=5000

# MySQL Config
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=url_shortener

# Redis Config
REDIS_URL=redis://localhost:6379

# Base URL of backend (used to generate complete short url)
BASE_URL=http://localhost:5000
