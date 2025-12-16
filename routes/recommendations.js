const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

// Generate personalized recommendations
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's favorite genres
        const favoriteGenres = user.preferences?.favoriteGenres || [];
        const favoriteMovies = user.preferences?.favoriteMovies || [];

        let recommendations = [];

        // If user has favorite genres, get recommendations based on them
        if (favoriteGenres.length > 0) {
            // Get genre IDs from genre names (simplified - in production, map genre names to IDs)
            const genreIds = favoriteGenres.slice(0, 2).join(','); // Limit to 2 genres
            
            // Get discover movies based on genres
            const discoverResponse = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
                params: {
                    api_key: TMDB_API_KEY,
                    with_genres: genreIds,
                    sort_by: 'popularity.desc',
                    page: 1
                }
            });

            recommendations = discoverResponse.data.results.slice(0, 20);
        } else {
            // If no preferences, get popular movies
            const popularResponse = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
                params: {
                    api_key: TMDB_API_KEY,
                    page: 1
                }
            });

            recommendations = popularResponse.data.results.slice(0, 20);
        }

        // Format recommendations
        const formattedRecommendations = recommendations.map(movie => ({
            movieId: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : null,
            releaseDate: movie.release_date,
            rating: movie.vote_average,
            genres: [] // Would need additional API call to get genre names
        }));

        // Save recommendations to database
        for (const rec of formattedRecommendations) {
            await Recommendation.findOneAndUpdate(
                { userId: req.userId, movieId: rec.movieId },
                {
                    userId: req.userId,
                    movieId: rec.movieId,
                    title: rec.title,
                    posterPath: rec.posterPath,
                    overview: rec.overview,
                    releaseDate: rec.releaseDate,
                    rating: rec.rating,
                    genres: rec.genres
                },
                { upsert: true, new: true }
            );
        }

        res.json({
            recommendations: formattedRecommendations,
            count: formattedRecommendations.length
        });
    } catch (error) {
        console.error('Recommendations error:', error);
        res.status(500).json({ message: 'Error generating recommendations' });
    }
});

// Get user's saved recommendations
router.get('/saved', auth, async (req, res) => {
    try {
        const recommendations = await Recommendation.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json(recommendations);
    } catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
});

// Update recommendation (mark as viewed, add rating)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { viewed, userRating } = req.body;

        const recommendation = await Recommendation.findOneAndUpdate(
            { _id: id, userId: req.userId },
            { viewed, userRating },
            { new: true }
        );

        if (!recommendation) {
            return res.status(404).json({ message: 'Recommendation not found' });
        }

        res.json(recommendation);
    } catch (error) {
        console.error('Update recommendation error:', error);
        res.status(500).json({ message: 'Error updating recommendation' });
    }
});

// Delete recommendation
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const recommendation = await Recommendation.findOneAndDelete({
            _id: id,
            userId: req.userId
        });

        if (!recommendation) {
            return res.status(404).json({ message: 'Recommendation not found' });
        }

        res.json({ message: 'Recommendation deleted' });
    } catch (error) {
        console.error('Delete recommendation error:', error);
        res.status(500).json({ message: 'Error deleting recommendation' });
    }
});

module.exports = router;

