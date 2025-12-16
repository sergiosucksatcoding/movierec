const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: Number, // TMDB movie/TV ID
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posterPath: String,
    overview: String,
    releaseDate: String,
    type: {
        type: String,
        enum: ['movie', 'tv'],
        required: true
    },
    watched: {
        type: Boolean,
        default: false
    },
    userRating: {
        type: Number,
        min: 1,
        max: 5
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
watchlistSchema.index({ userId: 1, movieId: 1 });

module.exports = mongoose.model('Watchlist', watchlistSchema);

