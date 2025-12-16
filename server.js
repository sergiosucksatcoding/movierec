require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files FIRST (before MongoDB connection)
app.use(express.static('public'));

// MongoDB Connection (lazy connection for serverless)
const MONGODB_URI = process.env.MONGODB_URI;

let mongooseConnection = null;

async function connectDB() {
    if (mongooseConnection) {
        return mongooseConnection;
    }

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined');
    }

    try {
        mongooseConnection = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('Connected to MongoDB');
        return mongooseConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Connect to MongoDB ONLY for API routes (not for static files)
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ 
            message: 'Database connection error', 
            error: error.message 
        });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/watchlist', require('./routes/watchlist'));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/recommendations', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'recommendations.html'));
});

app.get('/watchlist', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'watchlist.html'));
});

app.get('/movie', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'movie.html'));
});

// Start server (for local development)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export for Vercel
module.exports = app;