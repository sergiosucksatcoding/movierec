# MongoDB Atlas Setup Guide - Step by Step

## ⚠️ If You See: "You can't connect yet. Set up your user security permission in the first step."

This means you need to create a database user FIRST before you can get your connection string.

---

## Complete Setup Steps (IN ORDER)

### Step 1: Create MongoDB Atlas Account & Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and create an account
3. After logging in, you'll be asked to create a cluster:
   - Choose **FREE** tier (M0 Sandbox)
   - Select a cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region close to you
   - Click "Create Cluster"
   - Wait 3-5 minutes for cluster to be created

---

### Step 2: Create Database User ⭐ (DO THIS FIRST!)

This is the step you're missing! You need to create a user before connecting.

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"** button
3. Choose authentication method:
   - Select **"Password"**
   - **Username**: Create a username (e.g., `movieappuser` or `admin`)
   - **Password**: 
     - Click **"Autogenerate Secure Password"** (RECOMMENDED - saves you the password!)
     - OR create your own password
     - ⚠️ **SAVE THIS PASSWORD** - you'll need it for the connection string!
4. Under **"Database User Privileges"**:
   - Select **"Atlas admin"** (for development/school projects)
   - OR "Read and write to any database" (more secure)
5. Click **"Add User"**
6. Wait for user to be created

**✅ You now have a database user!**

---

### Step 3: Whitelist IP Address

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"** button
3. Choose one:
   - **Option A (Easier for development)**: Click **"Allow Access from Anywhere"**
     - This adds `0.0.0.0/0` (allows all IPs)
     - Good for development, but less secure
   - **Option B (More secure)**: Click **"Add Current IP Address"**
     - Only allows your current IP
     - You'll need to update this if your IP changes
4. Click **"Confirm"**
5. Wait a minute for it to take effect

**✅ Your IP is now whitelisted!**

---

### Step 4: Get Your Connection String

NOW you can get your connection string!

1. In the left sidebar, click **"Database"** (or **"Clusters"**)
2. Find your cluster and click the **"Connect"** button
3. A popup will appear with connection options
4. Select **"Drivers"** (or **"Connect your application"**)
5. Choose:
   - **Driver**: Node.js
   - **Version**: Latest (4.1 or later)
6. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Replace the placeholders:**
   - Replace `<username>` with the database username you created in Step 2
   - Replace `<password>` with the database password you created in Step 2
   - Add your database name after `.net/`:
   
   **Final connection string should look like:**
   ```
   mongodb+srv://movieappuser:YourPassword123@cluster0.xxxxx.mongodb.net/movie-recommendations?retryWrites=true&w=majority
   ```

8. Click **"Copy"** to copy the connection string

**✅ You now have your connection string!**

---

### Step 5: Add to Your .env File

1. Open your `.env` file in your project root
2. Replace the `MONGODB_URI` line with your connection string:

```env
MONGODB_URI=mongodb+srv://movieappuser:YourPassword123@cluster0.xxxxx.mongodb.net/movie-recommendations?retryWrites=true&w=majority
```

⚠️ **Important**: 
- Replace `movieappuser` with YOUR username
- Replace `YourPassword123` with YOUR password
- Replace `cluster0.xxxxx` with YOUR cluster name

3. Save the file

---

### Step 6: Test Your Connection

1. Make sure your `.env` file is saved
2. Start your server:
   ```bash
   npm start
   ```
3. Look for this message:
   ```
   Connected to MongoDB
   ```
4. If you see an error, check:
   - Username and password are correct
   - IP address is whitelisted
   - Connection string format is correct

---

## Common Issues

### "You can't connect yet. Set up your user security permission"
✅ **Solution**: Complete Step 2 (Create Database User) above

### "Authentication failed"
✅ **Solution**: 
- Check username and password in connection string
- Make sure you replaced `<username>` and `<password>` placeholders

### "IP not whitelisted"
✅ **Solution**: Complete Step 3 (Whitelist IP) above

### Connection timeout
✅ **Solution**: 
- Check your internet connection
- Verify IP is whitelisted
- Wait a few minutes after whitelisting IP

---

## Quick Checklist

Before connecting, make sure you have:
- [ ] Created a MongoDB Atlas account
- [ ] Created a free cluster
- [ ] ✅ **Created a database user** (username + password)
- [ ] ✅ **Whitelisted your IP address** (0.0.0.0/0 or your specific IP)
- [ ] Got your connection string
- [ ] Replaced `<username>` and `<password>` in connection string
- [ ] Added connection string to `.env` file

---

## Example Connection String

After all steps, your `.env` file should look like:

```env
MONGODB_URI=mongodb+srv://myusername:mypassword123@cluster0.abc123.mongodb.net/movie-recommendations?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-here
TMDB_API_KEY=your-tmdb-api-key-here
PORT=3000
```

---

**Need Help?** If you're still stuck, check which step you're on and follow the instructions above for that specific step!

