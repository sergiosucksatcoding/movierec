const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

// Get user's watchlist
router.get('/', auth, async (req, res) => {
    try {
        const watchlist = await Watchlist.find({ userId: req.userId })
            .sort({ addedAt: -1 });

        res.json(watchlist);
    } catch (error) {
        console.error('Get watchlist error:', error);
        res.status(500).json({ message: 'Error fetching watchlist' });
    }
});

// Add to watchlist
router.post('/', auth, async (req, res) => {
    try {
        const { movieId, title, posterPath, overview, releaseDate, type } = req.body;

        // Check if already in watchlist
        const existing = await Watchlist.findOne({ userId: req.userId, movieId });
        if (existing) {
            return res.status(400).json({ message: 'Already in watchlist' });
        }

        const watchlistItem = new Watchlist({
            userId: req.userId,
            movieId,
            title,
            posterPath,
            overview,
            releaseDate,
            type: type || 'movie'
        });

        await watchlistItem.save();
        res.status(201).json(watchlistItem);
    } catch (error) {
        console.error('Add to watchlist error:', error);
        res.status(500).json({ message: 'Error adding to watchlist' });
    }
});

// Update watchlist item (mark as watched, add rating)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { watched, userRating } = req.body;

        const watchlistItem = await Watchlist.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { watched, userRating },
            { new: true }
        );

        if (!watchlistItem) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        res.json(watchlistItem);
    } catch (error) {
        console.error('Update watchlist error:', error);
        res.status(500).json({ message: 'Error updating watchlist' });
    }
});

// Delete from watchlist
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const watchlistItem = await Watchlist.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!watchlistItem) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        console.error('Delete watchlist error:', error);
        res.status(500).json({ message: 'Error removing from watchlist' });
    }
});

module.exports = router;

