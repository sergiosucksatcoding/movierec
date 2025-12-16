const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    movieId: {
        type: Number, // TMDB movie ID
        required: true
    },
    title: {
        type: String,
        required: true
    },
    posterPath: String,
    overview: String,
    releaseDate: String,
    rating: Number,
    genres: [String],
    recommendationScore: {
        type: Number,
        default: 0
    },
    viewed: {
        type: Boolean,
        default: false
    },
    userRating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient queries
recommendationSchema.index({ userId: 1, movieId: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);

