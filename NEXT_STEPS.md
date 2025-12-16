# Next Steps - Quick Guide

## ✅ You Have:
- MongoDB connection string
- TMDB API key

## 🚀 What to Do Next:

### Step 1: Update .env File

1. Open the `.env` file in your project root folder
2. Replace `YOUR_TMDB_API_KEY_HERE` with your actual TMDB API key
3. Save the file

### Step 2: Generate JWT Secret (Optional but Recommended)

Open PowerShell/terminal and run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and replace `change-this-to-a-long-random-string-in-production` in your `.env` file.

OR just use a random long string for now (minimum 32 characters).

### Step 3: Install Dependencies

```bash
npm install
```

This will install all required packages (Express, MongoDB, etc.)

### Step 4: Start the Server

```bash
npm start
```

OR for development mode (auto-reload on changes):
```bash
npm run dev
```

### Step 5: Open in Browser

Go to: `http://localhost:3000`

You should see the landing page! 🎉

### Step 6: Test It Out

1. Click "Register" to create an account
2. Fill in username, email, password
3. You'll be redirected to the dashboard
4. Go to "Recommendations" to see movies
5. Search for movies and add them to your watchlist

---

## If You Get Errors:

**"Cannot find module"**: Run `npm install` again

**"MongoDB connection error"**: 
- Check your `.env` file has the correct MongoDB URI
- Make sure IP is whitelisted in MongoDB Atlas

**"TMDB API error"**: 
- Check your `.env` file has the correct TMDB_API_KEY

---

## Summary Commands:

```bash
# 1. Make sure .env file is updated with your TMDB API key
# 2. Install dependencies
npm install

# 3. Start server
npm start

# 4. Open browser to http://localhost:3000
```

That's it! You're ready to go! 🚀

