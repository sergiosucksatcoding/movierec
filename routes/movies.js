const express = require('express');
const router = express.Router();
const axios = require('axios');
const auth = require('../middleware/auth');

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Search movies
router.get('/search', async (req, res) => {
    try {
        const { query, page = 1 } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query,
                page
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Movie search error:', error);
        res.status(500).json({ message: 'Error searching movies' });
    }
});

// Search TV shows
router.get('/search-tv', async (req, res) => {
    try {
        const { query, page = 1 } = req.query;
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
            params: {
                api_key: TMDB_API_KEY,
                query,
                page
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('TV search error:', error);
        res.status(500).json({ message: 'Error searching TV shows' });
    }
});

// Get popular movies
router.get('/popular', async (req, res) => {
    try {
        const { page = 1 } = req.query;
        
        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
            params: {
                api_key: TMDB_API_KEY,
                page
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Popular movies error:', error);
        res.status(500).json({ message: 'Error fetching popular movies' });
    }
});

// Get genres (must come before /:id routes)
router.get('/genres/list', async (req, res) => {
    try {
        const [movieGenres, tvGenres] = await Promise.all([
            axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
                params: { api_key: TMDB_API_KEY }
            }),
            axios.get(`${TMDB_BASE_URL}/genre/tv/list`, {
                params: { api_key: TMDB_API_KEY }
            })
        ]);

        res.json({
            movie: movieGenres.data.genres,
            tv: tvGenres.data.genres
        });
    } catch (error) {
        console.error('Genres error:', error);
        res.status(500).json({ message: 'Error fetching genres' });
    }
});

// Get movie reviews from TMDB (must come before /:id route)
router.get('/:id/reviews', async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}/reviews`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Movie reviews error:', error);
        res.status(500).json({ message: 'Error fetching movie reviews' });
    }
});

// Get movie details (this must come AFTER /:id/reviews)
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Movie details error:', error);
        res.status(500).json({ message: 'Error fetching movie details' });
    }
});

// Get TV show details
router.get('/tv/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const response = await axios.get(`${TMDB_BASE_URL}/tv/${id}`, {
            params: {
                api_key: TMDB_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('TV details error:', error);
        res.status(500).json({ message: 'Error fetching TV show details' });
    }
});

module.exports = router;