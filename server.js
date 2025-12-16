require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined in .env file');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
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