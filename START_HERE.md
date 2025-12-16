# 🚀 Start Here - Movie Recommendation App Setup

## ✅ You Have:
- MongoDB connection string
- TMDB API key

## 📍 Your Project Location:
`C:\Users\ghost\movie-recommendation-app\`

---

## Step 1: Create/Update .env File

1. **Open your code editor** (VS Code, etc.)
2. **Open the folder**: `C:\Users\ghost\movie-recommendation-app`
3. **Create a new file** named `.env` (with the dot at the beginning!)
4. **Copy and paste this** into the `.env` file:

```env
MONGODB_URI=mongodb+srv://kingsergio:RhHwbGFwcnn7oAms@finalprojectfundamental.gstsrdt.mongodb.net/movie-recommendations?appName=finalprojectfundamentals
JWT_SECRET=my-super-secret-key-for-jwt-tokens-change-this-later-123456789
TMDB_API_KEY=PASTE_YOUR_TMDB_API_KEY_HERE
PORT=3000
```

5. **Replace `PASTE_YOUR_TMDB_API_KEY_HERE`** with your actual TMDB API key
6. **Save the file** (Ctrl+S)

---

## Step 2: Open Terminal in the Project Folder

1. Open **PowerShell** or **Command Prompt**
2. Navigate to the project:
   ```bash
   cd C:\Users\ghost\movie-recommendation-app
   ```

---

## Step 3: Install Dependencies

In the terminal, run:
```bash
npm install
```

This will install all required packages. Wait for it to finish (1-2 minutes).

---

## Step 4: Start the Server

Still in the terminal, run:
```bash
npm start
```

You should see:
```
Connected to MongoDB
Server running on http://localhost:3000
```

✅ **If you see this, your server is running!**

---

## Step 5: Open Your App

1. Open your web browser
2. Go to: **`http://localhost:3000`**
3. You should see your movie recommendation website! 🎉

---

## Step 6: Test It Out

1. Click **"Register"** button
2. Create an account:
   - Username: (pick any username)
   - Email: (your email)
   - Password: (minimum 6 characters)
3. Click **"Create Account"**
4. You'll be logged in and see the dashboard!

---

## 🎯 Quick Command Summary

```bash
# 1. Navigate to project folder
cd C:\Users\ghost\movie-recommendation-app

# 2. Install dependencies (first time only)
npm install

# 3. Start the server
npm start

# 4. Open browser to http://localhost:3000
```

---

## ❌ If You Get Errors:

**"Cannot find module"**:
→ Run `npm install` again

**"MongoDB connection error"**:
→ Check your `.env` file has the correct MongoDB URI
→ Make sure you saved the `.env` file

**"TMDB API error"**:
→ Check your `.env` file has your actual TMDB API key (not the placeholder)
→ Make sure there are no spaces around the `=` sign in `.env`

**"Cannot find .env"**:
→ Make sure `.env` is in `C:\Users\ghost\movie-recommendation-app\`
→ Make sure it's named exactly `.env` (with the dot!)

---

## ✅ Checklist

- [ ] Created `.env` file in `movie-recommendation-app` folder
- [ ] Added MongoDB connection string to `.env`
- [ ] Added TMDB API key to `.env`
- [ ] Saved `.env` file
- [ ] Ran `npm install`
- [ ] Ran `npm start`
- [ ] Opened `http://localhost:3000` in browser

---

**You're all set! Follow these steps and your app will be running!** 🚀

