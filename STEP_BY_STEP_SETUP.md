# Complete Step-by-Step Setup Guide

## What is a .env File?

A `.env` file is a **secret configuration file** that stores your API keys and passwords. It's like a safe where you keep your secrets - the code reads from it, but you never share it with anyone.

**Important**: 
- It's a hidden file (starts with a dot `.`)
- It's in your project root folder
- It's NOT a code file - it's just configuration
- It contains your secrets (API keys, passwords)

---

## Step 1: Create the .env File

### Option A: Using Your Code Editor (Easiest)

1. Open your code editor (VS Code, or whatever you're using)
2. In the **left sidebar**, look for your `portfolio-website` folder
3. **Right-click** in the folder (where you see `server.js`, `package.json`)
4. Click **"New File"**
5. Type exactly: `.env` (with the dot at the beginning!)
6. Press Enter

### Option B: Using File Explorer (Windows)

1. Open File Explorer
2. Go to: `C:\Users\ghost\portfolio-website`
3. Make sure you're in the folder that has `server.js` and `package.json`
4. Right-click in empty space → **New** → **Text Document**
5. Name it exactly: `.env` (remove the `.txt` part)
   - Windows might warn you - click "Yes" to change the extension

---

## Step 2: Add Your Configuration

Open the `.env` file you just created and copy-paste this EXACT content:

```env
MONGODB_URI=mongodb+srv://kingsergio:RhHwbGFwcnn7oAms@finalprojectfundamental.gstsrdt.mongodb.net/movie-recommendations?appName=finalprojectfundamentals
JWT_SECRET=my-super-secret-key-for-jwt-tokens-change-this-later-123456789
TMDB_API_KEY=PASTE_YOUR_TMDB_API_KEY_HERE
PORT=3000
```

**IMPORTANT**: Replace `PASTE_YOUR_TMDB_API_KEY_HERE` with your actual TMDB API key!

Save the file (Ctrl+S)

---

## Step 3: Install Dependencies

1. Open **PowerShell** or **Command Prompt**
2. Navigate to your project folder:
   ```bash
   cd C:\Users\ghost\portfolio-website
   ```
3. Install all required packages:
   ```bash
   npm install
   ```
4. Wait for it to finish (may take 1-2 minutes)

---

## Step 4: Start Your Server

Still in the terminal, run:
```bash
npm start
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:3000
```

---

## Step 5: Open Your App

1. Open your web browser (Chrome, Firefox, etc.)
2. Go to: `http://localhost:3000`
3. You should see your movie recommendation website! 🎉

---

## Step 6: Test It Out

1. Click **"Register"** button
2. Create an account:
   - Username: (any username)
   - Email: (your email)
   - Password: (any password, min 6 characters)
3. Click **"Create Account"**
4. You'll be logged in and see the dashboard!

---

## Quick Checklist

- [ ] Created `.env` file in project root
- [ ] Added MongoDB connection string to `.env`
- [ ] Added TMDB API key to `.env`
- [ ] Saved `.env` file
- [ ] Ran `npm install`
- [ ] Ran `npm start`
- [ ] Opened `http://localhost:3000` in browser

---

## If Something Goes Wrong

**"Cannot find module" error:**
→ Run `npm install` again

**"MongoDB connection error":**
→ Check your `.env` file has the correct MongoDB URI
→ Make sure you saved the `.env` file

**"TMDB API error":**
→ Check your `.env` file has your actual TMDB API key
→ Make sure there are no spaces around the `=` sign

**Can't find .env file:**
→ Make sure it's in the same folder as `server.js`
→ Make sure it's named exactly `.env` (with the dot!)
→ Try creating it again

---

## Visual Guide - Where .env Should Be

```
portfolio-website/
├── .env              ← YOUR .env FILE GOES HERE
├── server.js
├── package.json
├── public/
├── routes/
└── ...
```

The `.env` file is in the **same folder** as `server.js` and `package.json`.

---

**That's it! Follow these steps and you'll have your app running!** 🚀

