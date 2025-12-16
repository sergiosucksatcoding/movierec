# Production Deployment Checklist - API Keys & Secrets

## ⚠️ IMPORTANT: Before Deploying to Production

You need to replace placeholder values in **ONE place only**: your `.env` file (or environment variables in your cloud platform).

The code itself is fine - it reads from environment variables. However, if environment variables are not set, the code uses fallback values that MUST be replaced in production.

---

## 📝 Required Changes

### 1. Create/Update `.env` File

Create a `.env` file in your project root (if you don't have one) and set these values:

```env
# ❌ DON'T USE THESE - These are PLACEHOLDERS
# Replace with your actual values:

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-recommendations
JWT_SECRET=your-actual-long-random-secret-key-here-minimum-32-characters
TMDB_API_KEY=your-actual-tmdb-api-key-here
PORT=3000
```

### 2. Where to Get Your Values

#### **MONGODB_URI**
- **MongoDB Atlas (Recommended):**
  1. Go to https://www.mongodb.com/cloud/atlas
  2. Create account → Create free cluster
  3. Database Access → Create database user
  4. Network Access → Add IP (0.0.0.0/0 for all, or your server IP)
  5. Click "Connect" → Choose "Connect your application"
  6. Copy connection string: `mongodb+srv://username:password@cluster.mongodb.net/movie-recommendations`
  7. Replace `username` and `password` with your actual credentials

#### **JWT_SECRET**
- Generate a long, random string (minimum 32 characters)
- **Option 1 - Using Node.js:**
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```
- **Option 2 - Online generator:** https://randomkeygen.com/ (use CodeIgniter Encryption Keys)
- **Option 3 - Manual:** Create a long random string of letters, numbers, and symbols
- **Example:** `a7f3b9c2d8e1f4a6b5c7d9e2f1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2`

#### **TMDB_API_KEY**
1. Go to https://www.themoviedb.org/
2. Sign up for free account
3. Go to Settings → API
4. Request an API key (it's free)
5. Copy your API key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

---

## 🔒 Security Notes

### Code Files with Fallback Values (For Reference Only)

These files have fallback values, but you should **NOT** edit the code. Instead, make sure your `.env` file is set correctly:

#### **File: `routes/auth.js`** (Line 7)
```javascript
// ⚠️ This is a FALLBACK - make sure JWT_SECRET is in .env
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
```
**Action:** Set `JWT_SECRET` in `.env` file

#### **File: `middleware/auth.js`** (Line 11)
```javascript
// ⚠️ This is a FALLBACK - make sure JWT_SECRET is in .env
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production');
```
**Action:** Set `JWT_SECRET` in `.env` file

#### **File: `routes/movies.js`** (Line 6)
```javascript
// ⚠️ This is a FALLBACK - make sure TMDB_API_KEY is in .env
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
```
**Action:** Set `TMDB_API_KEY` in `.env` file

#### **File: `routes/recommendations.js`** (Line 8)
```javascript
// ⚠️ This is a FALLBACK - make sure TMDB_API_KEY is in .env
const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
```
**Action:** Set `TMDB_API_KEY` in `.env` file

#### **File: `server.js`** (Line 50)
```javascript
// ⚠️ This is a FALLBACK - make sure MONGODB_URI is in .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-recommendations';
```
**Action:** Set `MONGODB_URI` in `.env` file

---

## ✅ Pre-Deployment Checklist

Before deploying to production:

- [ ] Created `.env` file (or will set environment variables in cloud platform)
- [ ] Replaced `MONGODB_URI` with real MongoDB Atlas connection string
- [ ] Replaced `JWT_SECRET` with a long, random secret (32+ characters)
- [ ] Replaced `TMDB_API_KEY` with real TMDB API key
- [ ] **NEVER** commit `.env` file to Git (already in `.gitignore`)
- [ ] Verified `.gitignore` includes `.env`

---

## 🌐 Setting Environment Variables for Cloud Deployment

### Vercel
1. Go to your project in Vercel dashboard
2. Settings → Environment Variables
3. Add each variable:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `TMDB_API_KEY` = your TMDB API key
   - `PORT` = 3000 (or leave default)

### Heroku
```bash
heroku config:set MONGODB_URI="your-mongodb-connection-string"
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set TMDB_API_KEY="your-api-key"
heroku config:set PORT=3000
```

### AWS (Elastic Beanstalk)
1. AWS Console → Elastic Beanstalk → Configuration
2. Software → Environment Properties
3. Add each environment variable

### Azure
1. Azure Portal → App Service → Configuration
2. Application Settings → New application setting
3. Add each environment variable

### Google Cloud Platform
1. Cloud Console → Cloud Run → Edit & Deploy
2. Variables & Secrets → Add Variable
3. Add each environment variable

---

## 🧪 Testing Before Production

1. **Test locally with `.env` file:**
   ```bash
   npm install
   # Create .env with real values
   npm start
   ```

2. **Verify environment variables are loaded:**
   - App should connect to MongoDB
   - Movie search should work (uses TMDB API)
   - User registration/login should work (uses JWT_SECRET)

3. **Check for errors:**
   - No "fallback" warnings in console
   - MongoDB connection successful
   - TMDB API calls working

---

## ⚠️ Common Mistakes to Avoid

1. **Don't commit `.env` to Git** - It's already in `.gitignore`, but double-check
2. **Don't use placeholder values in production** - Always use real values
3. **Don't share your `.env` file** - Keep it private
4. **Use strong JWT_SECRET** - Minimum 32 characters, random
5. **Don't use default MongoDB connection** - Use MongoDB Atlas for production

---

## 📋 Summary

**You only need to replace values in ONE place:**
- Your `.env` file (for local development)
- Environment variables in your cloud platform (for production)

**You do NOT need to edit the code files** - they read from environment variables correctly. The fallback values are just for development/testing purposes.

**Make sure your `.env` file contains:**
```env
MONGODB_URI=your-real-connection-string
JWT_SECRET=your-real-secret-key
TMDB_API_KEY=your-real-api-key
PORT=3000
```

That's it! 🎉

